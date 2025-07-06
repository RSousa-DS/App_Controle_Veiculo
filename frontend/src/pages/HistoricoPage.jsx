import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function HistoricoPage() {
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [senha, setSenha] = useState('');
  const [reservaParaExcluir, setReservaParaExcluir] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [filtro, setFiltro] = useState({
    veiculo: '',
    responsavel: '',
    status: '',
    dataInicio: '',
    dataFim: '',
  });
  const [veiculos, setVeiculos] = useState([]);

  const fetchReservas = async () => {
    try {
      const response = await axios.get('/api/reservas/');
      setReservas(response.data);
    } catch (error) {
      setError('Erro ao buscar reservas.');
    }
  };

  useEffect(() => {
    fetchReservas();
    // Buscar veículos para o dropdown
    axios.get('/api/veiculos/').then(res => setVeiculos(res.data)).catch(() => setVeiculos([]));
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({ ...prev, [name]: value }));
  };

  const reservasFiltradas = reservas.filter(r => {
    const veiculoOk = !filtro.veiculo || r.veiculo === filtro.veiculo;
    const responsavelOk = !filtro.responsavel || r.responsavel.toLowerCase().includes(filtro.responsavel.toLowerCase());
    const statusAtual = r.data_devolucao ? 'Finalizada' : 'Pendente';
    const statusOk = !filtro.status || statusAtual === filtro.status;
    let dataOk = true;
    if (filtro.dataInicio) {
      dataOk = new Date(r.dataRetirada) >= new Date(filtro.dataInicio.split('/').reverse().join('-'));
    }
    if (dataOk && filtro.dataFim) {
      dataOk = new Date(r.dataRetirada) <= new Date(filtro.dataFim.split('/').reverse().join('-'));
    }
    return veiculoOk && responsavelOk && statusOk && dataOk;
  });

  const handleDeleteClick = (reserva) => {
    setReservaParaExcluir(reserva);
    setSenha('');
    setError('');
    setSuccess('');
    setShowModal(true);
  };

  const handleConfirmDelete = async () => {
    if (senha !== '12345') {
      setError('Senha incorreta.');
      return;
    }
    try {
      await axios.delete(`/api/reservas/${reservaParaExcluir.id}?senha=${senha}`);
      setSuccess('Reserva excluída com sucesso.');
      setShowModal(false);
      fetchReservas();
    } catch (err) {
      setError('Erro ao excluir reserva.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Histórico de Reservas</h2>
      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select className="form-control" name="veiculo" value={filtro.veiculo} onChange={handleFiltroChange}>
            <option value="">Todos os Veículos</option>
            {veiculos.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <input className="form-control" placeholder="Responsável" name="responsavel" value={filtro.responsavel} onChange={handleFiltroChange} />
        </div>
        <div className="col-md-3">
          <select className="form-control" name="status" value={filtro.status} onChange={handleFiltroChange}>
            <option value="">Todos</option>
            <option value="Pendente">Pendente</option>
            <option value="Finalizada">Finalizada</option>
          </select>
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Data Início" name="dataInicio" value={filtro.dataInicio} onChange={handleFiltroChange} onFocus={e => e.target.type='date'} onBlur={e => e.target.type='text'} pattern="\d{2}/\d{2}/\d{4}" />
        </div>
        <div className="col-md-3">
          <input type="text" className="form-control" placeholder="Data Fim" name="dataFim" value={filtro.dataFim} onChange={handleFiltroChange} onFocus={e => e.target.type='date'} onBlur={e => e.target.type='text'} pattern="\d{2}/\d{2}/\d{4}" />
        </div>
      </div>
      <div className="table-responsive mb-4">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Veículo</th>
              <th>Data de Retirada</th>
              <th>Data de Devolução Prevista</th>
              <th>Status</th>
              <th>🛣️ KM Percorrida</th>
              <th>Responsável</th>
              <th>Departamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservasFiltradas.length > 0 ? reservasFiltradas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.veiculo}</td>
                <td>{new Date(reserva.dataRetirada).toLocaleString('pt-BR')}</td>
                <td>{new Date(reserva.dataDevolucaoPrevista).toLocaleString('pt-BR')}</td>
                <td style={{background: reserva.data_devolucao ? '#d4edda' : '#f8d7da'}}>
  {reserva.data_devolucao ? 'Finalizada' : 'Pendente'}
</td>
                <td>{reserva.responsavel}</td>
                <td>{reserva.departamento}</td>
                <td>{(reserva.quilometragem_final && reserva.quilometragem_inicial) ? (reserva.quilometragem_final - reserva.quilometragem_inicial) : '-'}</td>
                <td>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDeleteClick(reserva)}>
                    Excluir
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={7} className="text-center text-muted">Nenhuma reserva encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {/* Modal Bootstrap para exclusão */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmar Exclusão</h5>
                <button type="button" className="close btn" onClick={() => setShowModal(false)}>&times;</button>
              </div>
              <div className="modal-body">
                <p>Digite a senha para excluir a reserva:</p>
                <input
                  type="password"
                  className="form-control mb-2"
                  value={senha}
                  onChange={e => setSenha(e.target.value)}
                  autoFocus
                />
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="button" className="btn btn-danger" onClick={handleConfirmDelete}>Excluir</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
