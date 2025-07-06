import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DevolucaoPage() {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ quilometragem_final: '', local_devolucao: '', observacoes: '', responsavel_devolucao: '' });
  const [painelFile, setPainelFile] = useState(null);
  const [painelPreview, setPainelPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const fetchReservas = async () => {
    try {
      const response = await axios.get('/api/reservas/');
      // Ajuste conforme o backend: status pode ser 'Reservado', 'Em Andamento', etc.
      const data = Array.isArray(response.data) ? response.data : [];
      setReservas(data.filter(reserva =>
  (reserva.status && reserva.status.toLowerCase() === 'pendente') ||
  (!reserva.data_devolucao || reserva.data_devolucao === null || reserva.data_devolucao === '')
));
    } catch (error) {
      setReservas([]);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleOpenModal = (reserva) => {
    setSelectedReserva(reserva);
    setFormData({ 
      quilometragem_final: '', 
      local_devolucao: '', 
      observacoes: '',
      responsavel_devolucao: reserva.responsavel // Preenche com o responsável da reserva
    });
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
      const formDataToSend = new FormData();
      formDataToSend.append('reservaId', selectedReserva.id);
      formDataToSend.append('kmDevolvido', formData.quilometragem_final);
      formDataToSend.append('localEstacionado', formData.local_devolucao);
      formDataToSend.append('responsavel', formData.responsavel_devolucao); // Campo ajustado para 'responsavel'
      formDataToSend.append('observacoes', formData.observacoes || '');
      
      if (painelFile) {
        formDataToSend.append('imagemPainel', painelFile, 'painel.jpg'); // Adiciona nome do arquivo
      }

      // Ajuste para usar o endpoint correto do backend
      const response = await axios.post('/api/devolucao', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && response.data.ok) {
        setSuccess(true);
        fetchReservas();
        handleCloseModal();
      } else {
        throw new Error('Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('Erro ao registrar devolução:', err);
      setError('Erro ao registrar devolução. Verifique os campos e tente novamente.');
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
                <td>{new Date(reserva.dataRetirada).toLocaleString('pt-BR')}</td>
                <td>{new Date(reserva.dataDevolucaoPrevista).toLocaleString('pt-BR')}</td>
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
                    <label className="form-label">Quilometragem Final * <span role="img" aria-label="odômetro">🛣️</span></label>
                    <input
                      type="number"
                      className="form-control"
                      name="quilometragem_final"
                      required
                      placeholder="Informe a quilometragem final"
                      value={formData.quilometragem_final}
                      onChange={e => setFormData(prev => ({ ...prev, quilometragem_final: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Local de Devolução * <span role="img" aria-label="local">📍</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="local_devolucao"
                      required
                      placeholder="Informe o local de devolução"
                      value={formData.local_devolucao}
                      onChange={e => setFormData(prev => ({ ...prev, local_devolucao: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Responsável pela Devolução <span role="img" aria-label="pessoa">👤</span></label>
                    <input
                      type="text"
                      className="form-control"
                      name="responsavel_devolucao"
                      required
                      placeholder="Informe o responsável pela devolução"
                      value={formData.responsavel_devolucao}
                      onChange={e => setFormData(prev => ({ ...prev, responsavel_devolucao: e.target.value }))}
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Imagem do Painel <span role="img" aria-label="painel">📷</span></label>
                    <input
                      type="file"
                      className="form-control"
                      accept="image/jpeg, image/png, image/webp"
                      onChange={async e => {
                        const file = e.target.files[0];
                        if (file) {
                          // Compressão de imagem
                          const imageCompression = (await import('browser-image-compression')).default;
                          const options = { maxSizeMB: 0.2, maxWidthOrHeight: 800, useWebWorker: true, fileType: 'image/webp' };
                          const compressed = await imageCompression(file, options);
                          setPainelFile(compressed);
                          setPainelPreview(URL.createObjectURL(compressed));
                        } else {
                          setPainelFile(null);
                          setPainelPreview(null);
                        }
                      }}
                    />
                    {painelPreview && (
                      <img src={painelPreview} alt="Painel Preview" style={{maxWidth: '100%', marginTop: 8, borderRadius: 8}} />
                    )}
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Observações <span role="img" aria-label="anotação">📝</span></label>
                    <textarea
                      className="form-control"
                      name="observacoes"
                      placeholder="Observações sobre a devolução"
                      value={formData.observacoes}
                      onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                      rows={3}
                    />
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Cancelar</button>
                  <button type="submit" className="btn btn-primary">✔️ Confirmar Devolução</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
