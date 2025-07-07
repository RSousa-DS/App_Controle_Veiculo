import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled, { keyframes, css } from 'styled-components';

const messageFadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const MessageContainer = styled.div`
  padding: 12px;
  border-radius: 8px;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  animation: ${messageFadeIn} 0.3s ease-out;
  
  ${({ type, theme }) => {
    switch (type) {
      case 'error':
        return css`
          background-color: ${theme.dangerLight};
          color: ${theme.danger};
        `;
      case 'success':
        return css`
          background-color: ${theme.successLight};
          color: ${theme.success};
        `;
      case 'warning':
        return css`
          background-color: ${theme.warningLight};
          color: ${theme.warning};
        `;
      default:
        return '';
    }
  }}
`;

const ErrorList = styled.ul`
  margin: 8px 0 0 20px;
  padding: 0;
  list-style-type: none;
  
  li {
    margin-bottom: 4px;
    display: flex;
    align-items: center;
    gap: 6px;
    
    &::before {
      content: '•';
      color: currentColor;
      font-weight: bold;
    }
  }
`;
import { FaCar, FaCalendarAlt, FaUser, FaCheckCircle, FaInfoCircle, FaMapMarkerAlt, FaCamera, FaClipboardList, FaSyncAlt, FaTachometerAlt } from 'react-icons/fa';
import { FaCalendarCheck } from 'react-icons/fa6';

// Cores baseadas no layout do menu
const colors = {
  primary: '#1a73e8',
  primaryLight: '#e8f0fe',
  secondary: '#34a853',
  background: '#f8f9fa',
  white: '#ffffff',
  text: '#202124',
  textSecondary: '#5f6368',
  border: '#dadce0',
  success: '#34a853',
  warning: '#f9ab00',
  error: '#d93025',
  danger: '#dc3545',
  gray50: '#f8f9fa',
  gray100: '#f8f9fa',
  gray200: '#e9ecef',
  gray300: '#dee2e6',
  gray400: '#ced4da',
  gray500: '#adb5bd'
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
`;

const shadow = '0 2px 6px rgba(0, 0, 0, 0.1)';
const transition = 'all 0.3s ease';

const MainContainer = styled.div`
  background: ${colors.background};
  min-height: 100vh;
  padding: 24px 16px;
  font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif;
  color: ${colors.text};
  
  @media (min-width: 768px) {
    padding: 32px 24px;
  }
`;

const Banner = styled.div`
  background: ${colors.white};
  color: ${colors.text};
  border-radius: 16px;
  padding: 20px 24px;
  margin: 0 auto 24px auto;
  max-width: 1200px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: ${shadow};
  animation: ${fadeIn} 0.5s;
  border-left: 4px solid ${colors.primary};
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    padding: 16px;
  }
`;

const BannerIcon = styled.div`
  font-size: 2rem;
  color: ${colors.primary};
  background: ${colors.primaryLight};
  border-radius: 50%;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  
  @media (max-width: 768px) {
    width: 40px;
    height: 40px;
    font-size: 1.5rem;
  }
`;

const BannerTitle = styled.h2`
  font-weight: 500;
  font-size: 1.5rem;
  margin: 0;
  color: ${colors.text};
  font-family: 'Google Sans', 'Segoe UI', Roboto, sans-serif;
  
  @media (max-width: 768px) {
    font-size: 1.3rem;
  }
`;

const TableContainer = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  box-shadow: ${shadow};
  max-width: 1200px;
  margin: 0 auto;
  padding: 0;
  animation: ${fadeIn} 0.6s;
  overflow: hidden;
  
  @media (max-width: 768px) {
    border-radius: 8px;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.9rem;
  
  thead {
    background: ${colors.primary};
    color: white;
    
    th {
      padding: 16px 12px;
      font-weight: 500;
      text-align: left;
      text-transform: uppercase;
      font-size: 0.75rem;
      letter-spacing: 0.5px;
      
      &:first-child {
        padding-left: 24px;
        border-top-left-radius: 12px;
      }
      
      &:last-child {
        padding-right: 24px;
        border-top-right-radius: 12px;
      }
    }
  }
  
  tbody {
    tr {
      transition: ${transition};
      border-bottom: 1px solid ${colors.border};
      
      &:hover {
        background: ${colors.gray100};
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      td {
        padding: 16px 12px;
        color: ${colors.text};
        vertical-align: middle;
        
        &:first-child {
          padding-left: 24px;
        }
        
        &:last-child {
          padding-right: 24px;
        }
      }
    }
  }
  
  @media (max-width: 768px) {
    thead {
      display: none;
    }
    
    tbody {
      tr {
        display: block;
        margin-bottom: 16px;
        border-radius: 8px;
        box-shadow: ${shadow};
        padding: 12px;
        
        td {
          display: flex;
          justify-content: space-between;
          padding: 8px 0;
          border: none;
          
          &::before {
            content: attr(data-label);
            font-weight: 500;
            color: ${colors.textSecondary};
            margin-right: 12px;
            min-width: 120px;
          }
          
          &:first-child {
            padding-top: 12px;
            padding-left: 0;
          }
          
          &:last-child {
            padding-bottom: 12px;
            padding-right: 0;
          }
        }
      }
    }
  }
`;

const StatusBadge = styled.span.attrs({
  // Remove a prop 'status' do DOM
  status: undefined,
})`
  display: inline-flex;
  align-items: center;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  background-color: ${props => {
    switch(props.$status) {
      case 'Devolvido': return '#e6f7ee';
      case 'Pendente': return '#fff8e6';
      case 'Atrasado': return '#ffebee';
      default: return '#f5f5f5';
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'Devolvido': return '#1a7f5f';
      case 'Pendente': return '#8a6d3b';
      case 'Atrasado': return '#c62828';
      default: return '#333';
    }
  }};
  
  svg {
    margin-right: 4px;
  }
`;

const ActionButton = styled.button.attrs({
  // Remove a prop 'variant' do DOM
  variant: undefined,
})`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  background-color: ${props => {
    switch(props.$variant) {
      case 'primary': return colors.primary;
      case 'secondary': return colors.secondary;
      case 'danger': return colors.danger;
      default: return '#f0f0f0';
    }
  }};
  color: ${props => props.$variant ? '#fff' : '#333'};
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    transform: none;
  }
  
  svg {
    font-size: 0.9em;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: ${fadeIn} 0.2s ease-out;
  padding: 16px;
`;

const ModalContent = styled.div`
  background: ${colors.white};
  border-radius: 12px;
  padding: 24px;
  width: 100%;
  max-width: 500px;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  
  @media (max-width: 480px) {
    padding: 20px 16px;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 16px;
  right: 16px;
  background: ${colors.gray200};
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: ${colors.text};
  opacity: 0.7;
  transition: ${transition};
  
  &:hover {
    opacity: 1;
    background: ${colors.gray300};
  }
  
  svg {
    font-size: 1.1rem;
  }
`;

const ModalTitle = styled.h3`
  font-size: 1.4rem;
  margin: 0 0 20px 0;
  color: ${colors.text};
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 10px;
  font-family: 'Google Sans', 'Segoe UI', Roboto, sans-serif;
  
  svg {
    color: ${colors.primary};
  }
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
    margin-bottom: 16px;
  }
`;

const ModalInfo = styled.div`
  margin: 0 0 16px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 0.95rem;
  line-height: 1.5;
  
  b {
    font-weight: 500;
    color: ${colors.text};
    margin-right: 4px;
  }
  
  svg {
    color: ${colors.primary};
    margin-right: 8px;
    flex-shrink: 0;
    width: 16px;
    height: 16px;
    margin-top: 3px;
  }
  
  @media (max-width: 480px) {
    font-size: 0.9rem;
  }
`;

const PanelImage = styled.img`
  max-width: 100%;
  border-radius: 8px;
  margin: 8px 0 16px 0;
  border: 1px solid ${colors.border};
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: block;
`;

const DetailCard = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${colors.white};
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  transition: all 0.2s ease;
  border: 1px solid ${colors.border};
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  }
  
  & > svg {
    flex-shrink: 0;
  }
  
  & > div {
    flex: 1;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
    
    & > svg {
      margin-bottom: 8px;
    }
  }
`;

const EmptyText = styled.td`
  text-align: center;
  color: #aaa;
  font-size: 1.1rem;
  padding: 32px 0;
`;

const DevolucaoPage = () => {
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
  const [painelPreview, setPainelPreview] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewReserva, setViewReserva] = useState(null);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/reservas/');
      
      if (response.data && Array.isArray(response.data)) {
        // Garante que os dados estejam no formato correto
        const reservasFormatadas = response.data.map(reserva => ({
          ...reserva,
          // Garante que os campos estejam presentes mesmo se forem nulos
          data_devolucao_real: reserva.data_devolucao_real || null,
          local_estacionado: reserva.local_estacionado || null,
          km_devolvido: reserva.km_devolvido || null,
          status_devolucao: reserva.statusDevolucao || 'Pendente',
          // Garante que o veículo seja uma string formatada
          veiculo: reserva.veiculo || (reserva.veiculo_rel 
            ? `${reserva.veiculo_rel.marca} ${reserva.veiculo_rel.modelo} - ${reserva.veiculo_rel.placa}`
            : 'Veículo não encontrado'
          )
        }));
        
        setReservas(reservasFormatadas);
      } else {
        console.error('Formato de dados inesperado:', response.data);
        setError('Formato de dados inesperado ao carregar reservas.');
      }
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setError('Erro ao carregar reservas. Verifique sua conexão e tente novamente.');
      setReservas([]); // Garante que o estado seja limpo em caso de erro
    } finally {
      setLoading(false);
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
    setFormErrors({});
    setSubmitAttempted(false);
    setError(null);
    setSuccess(false);
    setPainelFile(null);
    setPainelPreview('');
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedReserva(null);
    setShowModal(false);
    setError('');
    setSuccess(false);
    setFormErrors({});
    setSubmitAttempted(false);
    setPainelFile(null);
    setPainelPreview('');
  };

  const [formErrors, setFormErrors] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Verifica o tipo do arquivo
      const validTypes = ['image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 5 * 1024 * 1024; // 5MB
      
      if (!validTypes.includes(file.type)) {
        setFormErrors(prev => ({
          ...prev,
          imagemPainel: 'Formato de arquivo não suportado. Use JPG ou PNG.'
        }));
        return;
      }
      
      if (file.size > maxSize) {
        setFormErrors(prev => ({
          ...prev,
          imagemPainel: 'Arquivo muito grande. O tamanho máximo é 5MB.'
        }));
        return;
      }
      
      setPainelFile(file);
      setFormErrors(prev => ({
        ...prev,
        imagemPainel: null
      }));
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setPainelPreview(reader.result);
      };
      reader.onerror = () => {
        setFormErrors(prev => ({
          ...prev,
          imagemPainel: 'Erro ao carregar a imagem. Tente novamente.'
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    // Validação da quilometragem
    if (!formData.kmDevolvido) {
      errors.kmDevolvido = 'A quilometragem é obrigatória';
    } else if (isNaN(Number(formData.kmDevolvido)) || Number(formData.kmDevolvido) < 0) {
      errors.kmDevolvido = 'A quilometragem deve ser um número positivo';
    } else if (selectedReserva?.veiculo?.km_atual && Number(formData.kmDevolvido) < selectedReserva.veiculo.km_atual) {
      errors.kmDevolvido = `A quilometragem não pode ser menor que a atual (${selectedReserva.veiculo.km_atual} km)`;
    }
    
    // Validação do local estacionado
    if (!formData.localEstacionado?.trim()) {
      errors.localEstacionado = 'O local onde o veículo foi estacionado é obrigatório';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setError('');
    setSuccess('');
    
    // Validar o formulário
    if (!validateForm()) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
      return;
    }
    
    if (!selectedReserva) {
      setError('Nenhuma reserva selecionada para devolução');
      return;
    }
    
    // Verificar se a imagem do painel foi fornecida
    if (!painelFile) {
      setError('A foto do painel é obrigatória para registrar a devolução.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Criar FormData para enviar arquivos
      const formDataToSend = new FormData();
      
      // Adiciona os campos ao FormData com os nomes corretos esperados pelo backend Node/Multer
      formDataToSend.append('reservaId', selectedReserva.id);
      formDataToSend.append('kmDevolvido', formData.kmDevolvido);
      formDataToSend.append('localEstacionado', formData.localEstacionado.trim());
      formDataToSend.append('responsavelDevolucao', formData.responsavel_devolucao?.trim() || '');
      if (formData.observacoes?.trim()) {
        formDataToSend.append('observacoes', formData.observacoes.trim());
      }
      formDataToSend.append('imagemPainel', painelFile);
      
      // Mostrar feedback visual durante o envio
      setSuccess('Enviando dados...');
      
      // Enviar para o endpoint correto do backend Node
      const response = await axios.post('/api/devolucao', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
        timeout: 30000, // 30 segundos de timeout
      });
      
      if (response.data && response.data.ok) {
        setSuccess('Devolução registrada com sucesso!');
        
        // Limpar o formulário
        setFormData({
          kmDevolvido: '',
          localEstacionado: '',
          observacoes: '',
          responsavel_devolucao: ''
        });
        setPainelFile(null);
        setPainelPreview('');
        setFormErrors({});
        
        // Atualizar a lista de reservas após um pequeno atraso para o usuário ver a mensagem de sucesso
        setTimeout(() => {
          fetchReservas();
          handleCloseModal();
        }, 2000);
      } else {
        throw new Error(response.data?.message || 'Erro ao registrar a devolução');
      }
    } catch (error) {
      console.error('Erro ao registrar devolução:', error);
      
      // Tratamento de erros mais específico
      let errorMessage = 'Erro ao processar a devolução. Tente novamente.';
      
      if (error.response) {
        // Erro da API (4xx, 5xx)
        if (error.response.status === 422) {
          // Erro de validação do Laravel
          const validationErrors = error.response.data.errors || {};
          const firstError = Object.values(validationErrors)[0]?.[0];
          errorMessage = firstError || 'Dados inválidos. Verifique os campos do formulário.';
        } else if (error.response.status === 404) {
          errorMessage = 'Recurso não encontrado. Atualize a página e tente novamente.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Erro no servidor. Tente novamente mais tarde.';
        } else if (error.response.data?.message) {
          errorMessage = error.response.data.message;
        }
      } else if (error.request) {
        // Sem resposta do servidor
        errorMessage = 'Não foi possível conectar ao servidor. Verifique sua conexão com a internet.';
      } else if (error.code === 'ECONNABORTED') {
        errorMessage = 'Tempo de conexão esgotado. Verifique sua conexão com a internet e tente novamente.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
      
      // Rolar para o topo para mostrar a mensagem de erro
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpa o erro do campo quando o usuário começa a digitar
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: null
      }));
    }
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
    <MainContainer>
      <Banner>
        <BannerIcon>
          <FaCar />
        </BannerIcon>
        <BannerTitle>Controle de Devolução de Veículos</BannerTitle>
      </Banner>

      <TableContainer>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Carregando...</span>
            </div>
            <p style={{ marginTop: '1rem' }}>Carregando reservas...</p>
          </div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        ) : (
          <StyledTable>
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Responsável</th>
                <th>Data Retirada</th>
                <th>Data Devolução</th>
                <th>Local Estacionado</th>
                <th>Km Devolvido</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <EmptyText colSpan="8">Nenhuma reserva encontrada</EmptyText>
                </tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td data-label="Veículo">{reserva.veiculo}</td>
                    <td data-label="Responsável">{reserva.responsavel}</td>
                    <td data-label="DataRetirada">
                      {new Date(reserva.dataRetirada).toLocaleDateString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td data-label="Data Devolução">
                      {reserva.data_devolucao_real ? new Date(reserva.data_devolucao_real).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      }) : '-'}
                    </td>
                    <td data-label="Local Estacionado">
                      {reserva.local_estacionado || '-'}
                    </td>
                    <td data-label="Km Devolvido">
                      {reserva.km_devolvido || '-'}
                    </td>
                    <td data-label="Status">
                      <StatusBadge $status={reserva.statusDevolucao || 'Pendente'}>
                        {reserva.statusDevolucao || 'Pendente'}
                      </StatusBadge>
                    </td>
                    <td data-label="Ações">
                      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', flexWrap: 'wrap' }}>
                        <ActionButton
                          $variant="primary"
                          onClick={() => handleViewModal(reserva)}
                          style={{ 
                            minWidth: 'auto', 
                            opacity: reserva.status_devolucao === 'Devolvido' ? 1 : 0.5, 
                            pointerEvents: reserva.status_devolucao === 'Devolvido' ? 'auto' : 'none' 
                          }}
                          title={reserva.status_devolucao === 'Devolvido' ? 'Ver detalhes' : 'Apenas reservas devolvidas podem ser visualizadas'}
                        >
                          <FaInfoCircle /> Ver
                        </ActionButton>
                        {reserva.status_devolucao !== 'Devolvido' && (
                          <ActionButton
                            $variant="primary"
                            onClick={() => handleOpenModal(reserva)}
                            style={{ background: colors.secondary, minWidth: 'auto' }}
                          >
                            <FaCheckCircle /> Devolver
                          </ActionButton>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
        )}
      </TableContainer>


      
      {/* Modal de visualização */}
      {showViewModal && viewReserva && (
        <ModalOverlay onClick={() => setShowViewModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <CloseButton onClick={() => setShowViewModal(false)}>×</CloseButton>
            <ModalTitle>
              <FaInfoCircle /> Detalhes da Reserva
            </ModalTitle>
            
            <div style={{ 
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}>
              <DetailCard>
                <FaCar style={{ color: colors.primary, fontSize: '1.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Veículo</div>
                  <div style={{ fontWeight: 500 }}>{viewReserva.veiculo}</div>
                </div>
              </DetailCard>
              
              <DetailCard>
                <FaUser style={{ color: colors.primary, fontSize: '1.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Responsável</div>
                  <div style={{ fontWeight: 500 }}>{viewReserva.responsavel}</div>
                </div>
              </DetailCard>
              
              <DetailCard>
                <FaCalendarAlt style={{ color: colors.primary, fontSize: '1.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Retirada</div>
                  <div style={{ fontWeight: 500 }}>
                    {new Date(viewReserva.dataRetirada).toLocaleString('pt-BR', {
                      day: '2-digit',
                      month: '2-digit',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </DetailCard>
              
              <DetailCard>
                <FaCalendarCheck style={{ color: colors.primary, fontSize: '1.2rem' }} />
                <div>
                  <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Devolução Prevista</div>
                  <div style={{ fontWeight: 500 }}>
                    {viewReserva.dataDevolucaoPrevista 
                      ? new Date(viewReserva.dataDevolucaoPrevista).toLocaleString('pt-BR', {
                          day: '2-digit',
                          month: '2-digit',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })
                      : 'Não informada'}
                  </div>
                </div>
              </DetailCard>
              
              {viewReserva.status_devolucao === 'Devolvido' && (
                <>
                  <DetailCard>
                    <FaCalendarAlt style={{ color: colors.primary, fontSize: '1.2rem' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Devolução Realizada</div>
                      <div style={{ fontWeight: 500 }}>
                        {viewReserva.dataDevolucaoReal 
                          ? new Date(viewReserva.dataDevolucaoReal).toLocaleString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })
                          : '-'}
                      </div>
                    </div>
                  </DetailCard>
                  
                  <DetailCard>
                    <FaMapMarkerAlt style={{ color: colors.primary, fontSize: '1.2rem' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Local Estacionado</div>
                      <div style={{ fontWeight: 500 }}>{viewReserva.localEstacionado || 'Não informado'}</div>
                    </div>
                  </DetailCard>
                  
                  <DetailCard>
                    <FaTachometerAlt style={{ color: colors.primary, fontSize: '1.2rem' }} />
                    <div>
                      <div style={{ fontSize: '0.8rem', color: colors.textSecondary, marginBottom: '2px' }}>Quilometragem</div>
                      <div style={{ fontWeight: 500 }}>{viewReserva.kmDevolvido ? `${viewReserva.kmDevolvido} km` : 'Não informada'}</div>
                    </div>
                  </DetailCard>
                </>
              )}
            </div>
            
            {viewReserva.observacoes && (
              <div style={{ 
                backgroundColor: colors.gray50, 
                padding: '16px', 
                borderRadius: '8px',
                marginBottom: '24px'
              }}>
                <div style={{ 
                  fontSize: '0.9rem', 
                  color: colors.textSecondary,
                  marginBottom: '8px',
                  fontWeight: 500
                }}>
                  Observações:
                </div>
                <div style={{ whiteSpace: 'pre-line' }}>{viewReserva.observacoes}</div>
              </div>
            )}
            
            {viewReserva.imagemPainel && (
              <div style={{ marginTop: '24px' }}>
                <div style={{ 
                  fontSize: '0.95rem', 
                  fontWeight: 500,
                  marginBottom: '12px',
                  color: colors.text
                }}>
                  Foto do Painel:
                </div>
                <img 
                  src={`http://localhost:3001${viewReserva.imagemPainel}`} 
                  alt="Painel do veículo" 
                  style={{
                    maxWidth: '100%',
                    maxHeight: '300px',
                    borderRadius: '8px',
                    border: `1px solid ${colors.border}`,
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  onError={(e) => {
                    console.error('Erro ao carregar a imagem:', e);
                    e.target.style.display = 'none';
                    const errorMsg = document.createElement('div');
                    errorMsg.textContent = 'Erro ao carregar a imagem';
                    errorMsg.style.color = colors.error;
                    errorMsg.style.marginTop = '8px';
                    e.target.parentNode.appendChild(errorMsg);
                  }}
                />
              </div>
            )}
            
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '24px',
              paddingTop: '16px',
              borderTop: `1px solid ${colors.border}`
            }}>
              <ActionButton 
                type="button" 
                onClick={() => setShowViewModal(false)}
                style={{ 
                  background: colors.primary,
                  color: 'white'
                }}
              >
                Fechar
              </ActionButton>
            </div>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Modal de devolução */}
      {showModal && selectedReserva && (
        <ModalOverlay onClick={() => setShowModal(false)}>
          <ModalContent onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
            <CloseButton onClick={() => setShowModal(false)}>×</CloseButton>
            <ModalTitle>
              <FaCar style={{ marginRight: '8px' }} />
              Registrar Devolução
            </ModalTitle>
            
            <form onSubmit={handleSubmit}>
              {error && (
                <MessageContainer type="error">
                  <FaInfoCircle />
                  <div>{error}</div>
                </MessageContainer>
              )}
              
              {success && (
                <MessageContainer type="success">
                  <FaCheckCircle />
                  <div>{success}</div>
                </MessageContainer>
              )}
              
              <div style={{ marginBottom: '24px' }}>
                <div style={{ 
                  backgroundColor: colors.gray50, 
                  padding: '16px', 
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: colors.textSecondary,
                    marginBottom: '8px',
                    fontWeight: 500
                  }}>
                    Veículo: <span style={{ color: colors.text, fontWeight: 600 }}>{selectedReserva.veiculo}</span>
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: colors.textSecondary,
                    marginBottom: '8px'
                  }}>
                    Responsável: <span style={{ color: colors.text, fontWeight: 500 }}>{selectedReserva.responsavel}</span>
                  </div>
                  <div style={{ 
                    fontSize: '0.9rem', 
                    color: colors.textSecondary
                  }}>
                    Retirada em: <span style={{ color: colors.text, fontWeight: 500 }}>
                      {new Date(selectedReserva.dataRetirada).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 500,
                    color: colors.text,
                    fontSize: '0.95rem'
                  }}>
                    Quilometragem Atual
                    <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="number"
                    name="kmDevolvido"
                    value={formData.kmDevolvido}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${
                        formErrors.kmDevolvido ? colors.danger : colors.border
                      }`,
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    min="0"
                    step="1"
                    placeholder="Digite a quilometragem atual"
                  />
                  {formErrors.kmDevolvido && (
                    <div style={{
                      color: colors.danger,
                      fontSize: '0.8rem',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaInfoCircle /> {formErrors.kmDevolvido}
                    </div>
                  )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 500,
                    color: colors.text,
                    fontSize: '0.95rem'
                  }}>
                    Local onde o veículo foi estacionado
                    <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="localEstacionado"
                    value={formData.localEstacionado}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${
                        formErrors.localEstacionado ? colors.danger : colors.border
                      }`,
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Ex.: Estacionamento térreo, vaga 12"
                  />
                  {formErrors.localEstacionado && (
                    <div style={{
                      color: colors.danger,
                      fontSize: '0.8rem',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaInfoCircle /> {formErrors.localEstacionado}
                    </div>
                  )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 500,
                    color: colors.text,
                    fontSize: '0.95rem'
                  }}>
                    Responsável pela Devolução
                    <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
                  </label>
                  <input
                    type="text"
                    name="responsavel_devolucao"
                    value={formData.responsavel_devolucao}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${
                        formErrors.responsavel_devolucao ? colors.danger : colors.border
                      }`,
                      fontSize: '0.95rem',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Nome do responsável pela devolução"
                  />
                  {formErrors.responsavel_devolucao && (
                    <div style={{
                      color: colors.danger,
                      fontSize: '0.8rem',
                      marginTop: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaInfoCircle /> {formErrors.responsavel_devolucao}
                    </div>
                  )}
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 500,
                    color: colors.text,
                    fontSize: '0.95rem'
                  }}>
                    Observações
                  </label>
                  <textarea
                    name="observacoes"
                    value={formData.observacoes || ''}
                    onChange={handleChange}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      borderRadius: '8px',
                      border: `1px solid ${colors.border}`,
                      fontSize: '0.95rem',
                      minHeight: '100px',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                      transition: 'all 0.2s'
                    }}
                    placeholder="Adicione observações sobre a devolução (opcional)"
                  />
                </div>
                
                <div style={{ marginBottom: '20px' }}>
                  <label style={{
                    display: 'block',
                    marginBottom: '8px',
                    fontWeight: 500,
                    color: colors.text,
                    fontSize: '0.95rem'
                  }}>
                    Foto do Painel
                    <span style={{ color: colors.danger, marginLeft: '4px' }}>*</span>
                  </label>
                  {formErrors.imagemPainel && !painelPreview && (
                    <div style={{
                      color: colors.danger,
                      fontSize: '0.8rem',
                      marginBottom: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      <FaInfoCircle /> {formErrors.imagemPainel}
                    </div>
                  )}
                  <div 
                    style={{
                      border: `2px dashed ${
                        formErrors.imagemPainel 
                          ? colors.danger 
                          : painelPreview 
                            ? colors.primary 
                            : colors.border
                      }`,
                      borderRadius: '8px',
                      padding: painelPreview ? '16px' : '24px 16px',
                      textAlign: 'center',
                      marginBottom: '12px',
                      backgroundColor: painelPreview ? 'transparent' : colors.gray50,
                      transition: 'all 0.2s',
                      cursor: 'pointer'
                    }}
                    onDragOver={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (e.dataTransfer.files && e.dataTransfer.files[0]) {
                        const file = e.dataTransfer.files[0];
                        const event = { target: { files: [file] } };
                        handleFileChange(event);
                      }
                    }}
                  >
                    <input
                      type="file"
                      accept="image/jpeg, image/png, image/jpg"
                      capture="environment"
                      onChange={handleFileChange}
                      style={{
                        display: 'none'
                      }}
                      id="file-upload"
                    />
                    <label 
                      htmlFor="file-upload"
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        cursor: 'pointer',
                        width: '100%',
                        minHeight: '120px',
                        justifyContent: 'center'
                      }}
                    >
                      {painelPreview ? (
                        <>
                          <div style={{ 
                            position: 'relative',
                            width: '100%',
                            maxWidth: '300px',
                            margin: '0 auto 16px',
                            borderRadius: '6px',
                            overflow: 'hidden',
                            border: `1px solid ${colors.border}`
                          }}>
                            <div style={{ 
                              position: 'relative',
                              width: '100%',
                              maxWidth: '300px',
                              margin: '0 auto'
                            }}>
                              <img 
                                src={painelPreview} 
                                alt="Pré-visualização do painel" 
                                style={{ 
                                  display: 'block',
                                  width: '100%',
                                  height: 'auto',
                                  maxHeight: '200px',
                                  objectFit: 'contain',
                                  borderRadius: '4px'
                                }} 
                              />
                              <div style={{
                                position: 'absolute',
                                bottom: '8px',
                                left: '8px',
                                right: '8px',
                                background: 'rgba(0, 0, 0, 0.6)',
                                color: 'white',
                                padding: '4px 8px',
                                borderRadius: '4px',
                                fontSize: '0.8rem',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: '4px'
                              }}>
                                <FaSyncAlt size={12} /> Clique para trocar a imagem
                              </div>
                            </div>
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                setFormData({...formData, imagemPainel: null});
                                setPainelFile(null);
                                setPainelPreview(null);
                              }}
                              style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                background: 'rgba(0,0,0,0.6)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '28px',
                                height: '28px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                cursor: 'pointer',
                                fontSize: '16px',
                                '&:hover': {
                                  background: 'rgba(0,0,0,0.8)'
                                }
                              }}
                            >
                              ×
                            </button>
                          </div>
                          <div style={{ 
                            color: colors.primary, 
                            fontWeight: 500, 
                            fontSize: '0.9rem',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            marginTop: '12px'
                          }}>
                            <FaCamera /> Tirar foto do painel
                          </div>
                          <div style={{ 
                            fontSize: '0.8rem',
                            color: colors.textSecondary,
                            marginTop: '4px'
                          }}>
                            ou arraste e solte uma imagem aqui
                          </div>
                        </>
                      ) : (
                        <>
                            <div style={{
                              width: '60px',
                              height: '60px',
                              borderRadius: '50%',
                              backgroundColor: colors.primaryLight + '30',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              marginBottom: '12px'
                            }}>
                              <FaCamera style={{ 
                                fontSize: '24px', 
                                color: colors.primary,
                              }} />
                            </div>
                            <div style={{ 
                              color: colors.primary, 
                              fontWeight: 500,
                              marginBottom: '4px',
                              fontSize: '1rem'
                            }}>
                              Adicionar foto do painel
                            </div>
                            <div style={{ 
                              fontSize: '0.85rem', 
                              color: colors.textSecondary,
                              maxWidth: '280px',
                              margin: '0 auto',
                              lineHeight: '1.4'
                            }}>
                              Tire uma foto nítida do painel do veículo mostrando claramente a quilometragem
                            </div>
                        </>
                      )}
                    </label>
                  </div>
                  <div style={{ 
                    fontSize: '0.8rem', 
                    color: colors.textSecondary,
                    marginTop: '4px',
                    fontStyle: 'italic'
                  }}>
                    * A foto deve mostrar claramente a quilometragem do veículo
                  </div>
                </div>
              </div>
              
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end', 
                gap: '12px',
                flexWrap: 'wrap',
                borderTop: `1px solid ${colors.border}`,
                paddingTop: '20px',
                marginTop: '8px'
              }}>
                <ActionButton
                  type="button"
                  variant=""
                  onClick={() => setShowModal(false)}
                  style={{ 
                    background: 'transparent', 
                    color: colors.text, 
                    border: `1px solid ${colors.border}`
                  }}
                >
                  Cancelar
                </ActionButton>
                <ActionButton
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  style={{ 
                    background: colors.secondary,
                    minWidth: '180px',
                    opacity: isSubmitting ? 0.8 : 1
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <svg width="16" height="16" viewBox="0 0 38 38" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '8px' }}>
                        <defs>
                          <linearGradient x1="8.042%" y1="0%" x2="65.682%" y2="23.865%" id="a">
                            <stop stopColor="#fff" stopOpacity="0" offset="0%"/>
                            <stop stopColor="#fff" stopOpacity=".631" offset="63.146%"/>
                            <stop stopColor="#fff" offset="100%"/>
                          </linearGradient>
                        </defs>
                        <g fill="none" fillRule="evenodd">
                          <g transform="translate(1 1)">
                            <path d="M36 18c0-9.94-8.06-18-18-18" id="Oval-2" stroke="url(#a)" strokeWidth="2">
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="0.9s"
                                repeatCount="indefinite" />
                            </path>
                            <circle fill="#fff" cx="36" cy="18" r="1">
                              <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 18 18"
                                to="360 18 18"
                                dur="0.9s"
                                repeatCount="indefinite" />
                            </circle>
                          </g>
                        </g>
                      </svg>
                      Processando...
                    </>
                  ) : (
                    <>
                      <FaCheckCircle style={{ marginRight: '6px' }} />
                      Confirmar Devolução
                    </>
                  )}
                </ActionButton>
              </div>
            </form>
          </ModalContent>
        </ModalOverlay>
      )}
    </MainContainer>
  );
}

export default DevolucaoPage;
