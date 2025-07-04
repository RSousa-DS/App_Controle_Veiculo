const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Configuração do upload
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const dir = path.join(__dirname, 'uploads');
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    cb(null, dir);
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, unique + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// Banco de dados
const db = new sqlite3.Database(path.join(__dirname, 'db.sqlite'));
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS reservas (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    veiculo TEXT NOT NULL,
    dataRetirada TEXT NOT NULL,
    dataDevolucaoPrevista TEXT NOT NULL,
    dataDevolucaoReal TEXT,
    responsavel TEXT NOT NULL,
    email TEXT NOT NULL,
    departamento TEXT NOT NULL,
    kmDevolvido INTEGER,
    localEstacionado TEXT,
    imagemPainel TEXT,
    statusDevolucao TEXT NOT NULL DEFAULT 'Reservado'
  )`);
});

// Utilitário: checa sobreposição de horários
function checkOverlap(veiculo, retirada, devolucao, reservaId, cb) {
  db.all(
    `SELECT * FROM reservas WHERE veiculo = ? AND statusDevolucao = 'Reservado' AND id != ? AND ((dataRetirada < ? AND dataDevolucaoPrevista > ?) OR (dataRetirada < ? AND dataDevolucaoPrevista > ?) OR (dataRetirada >= ? AND dataRetirada < ?))`,
    [veiculo, reservaId || 0, devolucao, retirada, retirada, devolucao, retirada, devolucao],
    (err, rows) => cb(rows && rows.length > 0)
  );
}

// Rotas
app.get('/api/veiculos', (req, res) => {
  res.json(['T-Cross', 'Polo VW']);
});

app.get('/api/reservas', (req, res) => {
  let filtro = [];
  let params = [];
  if (req.query.veiculo) { filtro.push('veiculo = ?'); params.push(req.query.veiculo); }
  if (req.query.status) { filtro.push('statusDevolucao = ?'); params.push(req.query.status); }
  if (req.query.responsavel) { filtro.push('responsavel LIKE ?'); params.push('%' + req.query.responsavel + '%'); }
  if (req.query.data) {
    filtro.push('(date(dataRetirada) <= date(?) AND date(dataDevolucaoPrevista) >= date(?))');
    params.push(req.query.data, req.query.data);
  }
  const sql = 'SELECT * FROM reservas' + (filtro.length ? ' WHERE ' + filtro.join(' AND ') : '') + ' ORDER BY dataRetirada DESC';
  db.all(sql, params, (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.post('/api/reservas', (req, res) => {
  const {veiculo, dataRetirada, dataDevolucaoPrevista, responsavel, email, departamento} = req.body;
  if (!veiculo || !dataRetirada || !dataDevolucaoPrevista || !responsavel || !email || !departamento)
    return res.status(400).json({error: 'Campos obrigatórios não preenchidos'});
  checkOverlap(veiculo, dataRetirada, dataDevolucaoPrevista, null, overlap => {
    if (overlap) return res.status(409).json({error: 'Horário já reservado para este veículo!'});
    db.run(`INSERT INTO reservas (veiculo, dataRetirada, dataDevolucaoPrevista, responsavel, email, departamento) VALUES (?, ?, ?, ?, ?, ?)`,
      [veiculo, dataRetirada, dataDevolucaoPrevista, responsavel, email, departamento],
      function(err) {
        if (err) return res.status(500).json({error: err.message});
        res.json({id: this.lastID});
      }
    );
  });
});

app.post('/api/devolucao', upload.single('imagemPainel'), (req, res) => {
  const {reservaId, kmDevolvido, localEstacionado} = req.body;
  if (!reservaId || !kmDevolvido || !localEstacionado || !req.file)
    return res.status(400).json({error: 'Campos obrigatórios não preenchidos'});
  db.run(`UPDATE reservas SET statusDevolucao = 'Devolvido', dataDevolucaoReal = datetime('now', 'localtime'), kmDevolvido = ?, localEstacionado = ?, imagemPainel = ? WHERE id = ?`,
    [kmDevolvido, localEstacionado, '/uploads/' + req.file.filename, reservaId],
    function(err) {
      if (err) return res.status(500).json({error: err.message});
      res.json({ok: true});
    }
  );
});

app.delete('/api/reservas/:id', (req, res) => {
  const {senha} = req.body;
  const id = req.params.id;
  if (senha !== '12345') return res.status(403).json({error: 'Senha incorreta'});
  db.get('SELECT statusDevolucao FROM reservas WHERE id = ?', [id], (err, row) => {
    if (err || !row) return res.status(404).json({error: 'Reserva não encontrada'});
    if (row.statusDevolucao !== 'Reservado') return res.status(400).json({error: 'Só é possível excluir reservas com status Reservado'});
    db.run('DELETE FROM reservas WHERE id = ?', [id], err2 => {
      if (err2) return res.status(500).json({error: err2.message});
      res.json({ok: true});
    });
  });
});

// Reservas do usuário não devolvidas
app.get('/api/minhas-reservas', (req, res) => {
  const {email} = req.query;
  if (!email) return res.status(400).json({error: 'Informe o email'});
  db.all('SELECT * FROM reservas WHERE email = ? AND statusDevolucao = "Reservado"', [email], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

// Reservas futuras para calendário/grade
app.get('/api/calendario', (req, res) => {
  const {veiculo} = req.query;
  if (!veiculo) return res.status(400).json({error: 'Informe o veículo'});
  db.all('SELECT * FROM reservas WHERE veiculo = ? AND statusDevolucao = "Reservado" AND dataDevolucaoPrevista > datetime("now", "localtime")', [veiculo], (err, rows) => {
    if (err) return res.status(500).json({error: err.message});
    res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log('Backend rodando em http://localhost:' + PORT);
});
