import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function DevolucaoPage() {
  const [reservas, setReservas] = useState([]);
  const [selectedReserva, setSelectedReserva] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ 
    kmDevolvido: '', 
    localEstacionado: '', 
    observacoes: '', 
    responsavel_devolucao: '' 
  });
  const [painelFile, setPainelFile] = useState(null);
  const [painelPreview, setPainelPreview] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewReserva, setViewReserva] = useState(null);

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
      kmDevolvido: '', 
      localEstacionado: '', 
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
      if (!formData.kmDevolvido || !formData.localEstacionado || !painelFile) {
        throw new Error('Preencha todos os campos obrigatórios (quilometragem, local e foto do painel)');
      }
      
      const formDataToSend = new FormData();
      formDataToSend.append('reservaId', selectedReserva.id);
      formDataToSend.append('kmDevolvido', formData.kmDevolvido);
      formDataToSend.append('localEstacionado', formData.localEstacionado);
      formDataToSend.append('imagemPainel', painelFile, 'painel.jpg');
      
      // Campos opcionais
      if (formData.observacoes) {
        formDataToSend.append('observacoes', formData.observacoes);
      }

      // Ajuste para usar o endpoint correto do backend
      const response = await axios.post('/api/devolucao', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      
      if (response.data && response.data.ok) {
        setSuccess(true);
        // Limpa o formulário e recarrega a lista de reservas
        setFormData({ kmDevolvido: '', localEstacionado: '', observacoes: '', responsavel_devolucao: '' });
        setPainelFile(null);
        setPainelPreview(null);
        fetchReservas();
        // Fecha o modal após 1.5 segundos para o usuário ver a mensagem de sucesso
        setTimeout(() => {
          handleCloseModal();
        }, 1500);
      } else {
        throw new Error(response.data?.error || 'Resposta inválida do servidor');
      }
    } catch (err) {
      console.error('Erro ao registrar devolução:', err);
      setError(err.response?.data?.error || err.message || 'Erro ao registrar devolução. Verifique os campos e tente novamente.');
    }
  };

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleViewModal = (reserva) => {
    setViewReserva(reserva);
    setShowViewModal(true);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewReserva(null);
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
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {reservas.length > 0 ? reservas.map((reserva) => {
              // Suporte tanto para statusDevolucao (backend) quanto status_devolucao (frontend)
              const status = reserva.statusDevolucao || reserva.status_devolucao || reserva.status;
              return (
                <tr key={reserva.id}>
                  <td>{reserva.veiculo}</td>
                  <td>{reserva.dataRetirada ? new Date(reserva.dataRetirada).toLocaleString() : reserva.data_retirada ? new Date(reserva.data_retirada).toLocaleString() : ''}</td>
                  <td>{reserva.dataDevolucaoPrevista ? new Date(reserva.dataDevolucaoPrevista).toLocaleString() : reserva.data_devolucao_prevista ? new Date(reserva.data_devolucao_prevista).toLocaleString() : ''}</td>
                  <td>{reserva.responsavel}</td>
                  <td>{reserva.departamento}</td>
                  <td>
                    {status === 'Devolvido' ? (
                      <span className="badge bg-success">Devolvido</span>
                    ) : (
                      <span className="badge bg-warning text-dark">Pendente</span>
                    )}
                  </td>
                  <td>
                    {status !== 'Devolvido' ? (
                      <button className="btn btn-primary btn-sm" onClick={() => handleOpenModal(reserva)}>
                        Devolver
                      </button>
                    ) : (
                      <button className="btn btn-info btn-sm" onClick={() => handleViewModal(reserva)}>
                        VER
                      </button>
                    )}
                  </td>
                </tr>
              );
            }) : (
              <tr>
                <td colSpan={7} className="text-center text-muted">Nenhuma reserva encontrada.</td>
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
                    name="kmDevolvido"
                    required
                    placeholder="Informe a quilometragem final"
                    value={formData.kmDevolvido}
                    onChange={e => setFormData(prev => ({ ...prev, kmDevolvido: e.target.value }))}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Local de Estacionamento * <span role="img" aria-label="local">📍</span></label>
                  <input
                    type="text"
                    className="form-control"
                    name="localEstacionado"
                    required
                    placeholder="Informe o local de estacionamento"
                    value={formData.localEstacionado}
                    onChange={e => setFormData(prev => ({ ...prev, localEstacionado: e.target.value }))}
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
                    <div className="mt-2">
                      <img src={painelPreview} alt="Prévia do painel" className="img-fluid" style={{ maxHeight: '200px' }} />
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Observações <span role="img" aria-label="observações">📝</span></label>
                  <textarea
                    className="form-control"
                    name="observacoes"
                    rows="3"
                    placeholder="Alguma observação sobre a devolução?"
                    value={formData.observacoes}
                    onChange={e => setFormData(prev => ({ ...prev, observacoes: e.target.value }))}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>
                  Fechar
                </button>
                <button type="submit" className="btn btn-primary">
                  Registrar Devolução
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      )}
      {showViewModal && viewReserva && (
        <div className="modal fade show" style={{display: 'block', background: 'rgba(0,0,0,0.5)', animation: 'fadeIn 0.3s'}} tabIndex="-1">
          <div className="modal-dialog modal-dialog-centered modal-lg animate__animated animate__fadeInUp">
            <div className="modal-content">
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Detalhes da Devolução</h5>
                <button type="button" className="btn-close btn-close-white" onClick={handleCloseViewModal}></button>
              </div>
              <div className="modal-body">
                <div className="row g-3 align-items-center">
                  <div className="col-md-6">
                    <strong>Veículo:</strong> {viewReserva.veiculo}<br/>
                    <strong>Responsável:</strong> {viewReserva.responsavel}<br/>
                    <strong>Departamento:</strong> {viewReserva.departamento}<br/>
                    <strong>Data de Retirada:</strong> {viewReserva.dataRetirada ? new Date(viewReserva.dataRetirada).toLocaleString() : viewReserva.data_retirada ? new Date(viewReserva.data_retirada).toLocaleString() : ''}<br/>
                    <strong>Data Devolução Prevista:</strong> {viewReserva.dataDevolucaoPrevista ? new Date(viewReserva.dataDevolucaoPrevista).toLocaleString() : viewReserva.data_devolucao_prevista ? new Date(viewReserva.data_devolucao_prevista).toLocaleString() : ''}<br/>
                    <strong>Data Devolução Real:</strong> {viewReserva.dataDevolucaoReal ? viewReserva.dataDevolucaoReal : viewReserva.data_devolucao_real || '-'}<br/>
                    <strong>Quilometragem Devolução:</strong> {viewReserva.kmDevolvido || viewReserva.km_devolvido || '-'}<br/>
                    <strong>Local Estacionado:</strong> {viewReserva.localEstacionado || viewReserva.local_estacionado || '-'}<br/>
                    <strong>Responsável Devolução:</strong> {viewReserva.responsavel_devolucao || '-'}<br/>
                    <strong>Observações:</strong> {viewReserva.observacoes || '-'}<br/>
                  </div>
                  <div className="col-md-6 text-center">
                    <strong>Imagem do Painel:</strong><br/>
                    {viewReserva.imagemPainel || viewReserva.imagem_painel ? (
                      <img src={viewReserva.imagemPainel || viewReserva.imagem_painel} alt="Painel" className="img-fluid rounded shadow" style={{maxHeight: '300px', transition: 'transform 0.3s', animation: 'zoomIn 0.5s'}} />
                    ) : (
                      <span className="text-muted">Não enviada</span>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={handleCloseViewModal}>Fechar</button>
              </div>
            </div>
          </div>
          <style>{`
            @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
            @keyframes zoomIn { from { transform: scale(0.8); opacity: 0; } to { transform: scale(1); opacity: 1; } }
          `}</style>
        </div>
      )}
    </div>
  );
}
