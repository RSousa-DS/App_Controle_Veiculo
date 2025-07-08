import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.js';
import usuarioRoutes from './routes/usuarios.js';

// Carrega as variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true
}));
app.use(express.json());

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);

// Rota de teste
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Servidor rodando com sucesso!' });
});

// Middleware para tratamento de erros
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    status: 'error',
    message: 'Erro interno do servidor',
    ...(process.env.NODE_ENV === 'development' && { error: err.message })
  });
});

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`🔗 Acesse: http://localhost:${PORT}`);
});
