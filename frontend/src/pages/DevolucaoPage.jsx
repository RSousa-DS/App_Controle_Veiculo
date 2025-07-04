import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DevolucaoPage() {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ quilometragem_final: '', local_devolucao: '', observacoes: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchReservas = async () => {
    try {
      const response = await axios.get('/api/reservas/');
      // Ajuste conforme o backend: status pode ser 'Reservado', 'Em Andamento', etc.
      const data = Array.isArray(response.data) ? response.data : [];
      setReservas(data.filter(reserva => reserva.status === 'Reservado' || reserva.status === 'Em Andamento'));
    } catch (error) {
      setReservas([]);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva);
    setFormData({ quilometragem_final: '', local_devolucao: '', observacoes: '' });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReserva(null);
    setShowModal(false);
    setError('');
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    if (!selectedReserva) return;
    try {
      await axios.put(`/api/reservas/${selectedReserva.id}/devolucao`, {
        ...formData,
        data_devolucao: new Date().toISOString()
      });
      setSuccess(true);
      fetchReservas();
      handleCloseModal();
    } catch (err) {
      setError('Erro ao registrar devolução. Por favor, tente novamente.');
    }
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Devolução de Veículo</h2>
      <div className="table-responsive mb-4">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Veículo</th>
              <th>Data de Retirada</th>
              <th>Data de Devolução Prevista</th>
              <th>Responsável</th>
              <th>Departamento</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? reservas.map((reserva) => (
              <tr key={reserva.id}>
                <td>{reserva.veiculo}</td>
                <td>{new Date(reserva.data_retirada).toLocaleString('pt-BR')}</td>
                <td>{new Date(reserva.data_devolucao_prevista).toLocaleString('pt-BR')}</td>
                <td>{reserva.responsavel}</td>
                <td>{reserva.departamento}</td>
                <td>
                  <button className="btn btn-success btn-sm" onClick={() => handleOpenModal(reserva)}>
                    Devolver
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={6} className="text-center text-muted">Nenhuma reserva disponível para devolução.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal Bootstrap */}
      {showModal && (
        <div className="modal fade show d-block" tabIndex="-1" role="dialog" style={{ background: 'rgba(0,0,0,0.4)' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Registrar Devolução</h5>
                <button type="button" className="close btn" onClick={handleCloseModal}>&times;</button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body">
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">Devolução registrada com sucesso!</div>}
                  <div className="mb-3">
                    <label className="form-label">Quilometragem Final *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="quilometragem_final"
                      required
                      value={formData.quilometragem_final}
                      onChange={e => setFormData(prev => ({ ...prev, quilometragem_final: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Local de Devolução *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="local_devolucao"
                      required
                      value={formData.local_devolucao}
                      onChange={e => setFormData(prev => ({ ...prev, local_devolucao: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações</label>
                    <textarea
                      className="form-control"
                      name="observacoes"
                      value={formData.observacoes}
                      onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">Confirmar Devolução</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
