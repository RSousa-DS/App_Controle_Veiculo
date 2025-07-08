import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import styled from 'styled-components';
import { 
  FaCar, 
  FaUser, 
  FaCalendarAlt, 
  FaBuilding, 
  FaInfoCircle, 
  FaSearch,
  FaFilter,
  FaTrash,
  FaCheckCircle,
  FaTimesCircle,
  FaClock
} from 'react-icons/fa';

// Estilos
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
`;

const Title = styled.h2`
  color: #1a73e8;
  margin-bottom: 24px;
  font-weight: 600;
`;

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  background: #1a73e8;
  color: white;
  padding: 16px 24px;
  font-size: 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
`;

const FilterSection = styled.div`
  padding: 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
`;

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: block;
  margin-bottom: 5px;
  font-size: 0.9rem;
  color: #495057;
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #ced4da;
  border-radius: 6px;
  font-size: 0.95rem;
  background-color: white;
`;

const ResetButton = styled.button`
  background: #6c757d;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.95rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 25px;
  
  &:hover {
    background: #5a6268;
  }
`;

const ReservasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
`;

const ReservaCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  background: white;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ReservaHeader = styled.div`
  background: ${props => {
    if (props.$status === 'finalizada') return '#e6f4ea';
    if (props.$status === 'pendente') return '#fef7e0';
    return '#f5f6fa';
  }};
  padding: 16px;
  border-bottom: 1px solid #e0e0e0;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const VeiculoInfo = styled.div`
  font-size: 1.1rem;
  font-weight: 500;
  color: #1a73e8;
`;

const StatusBadge = styled.span`
  background: ${props => {
    if (props.$status === 'finalizada') return '#e6f4ea';
    if (props.$status === 'pendente') return '#fef7e0';
    return '#f5f6fa';
  }};
  color: ${props => {
    if (props.$status === 'finalizada') return '#34a853';
    if (props.$status === 'pendente') return '#fbbc04';
    return '#6c757d';
  }};
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ReservaBody = styled.div`
  padding: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: flex-start;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #555;
  
  svg {
    color: #1a73e8;
    margin-right: 10px;
    margin-top: 3px;
    width: 16px;
    text-align: center;
    flex-shrink: 0;
  }
  
  span {
    flex: 1;
  }
`;

const DataInfo = styled.div`
  background: #f8f9fa;
  padding: 12px;
  border-radius: 6px;
  margin-top: 10px;
  
  div {
    margin-bottom: 5px;
    font-size: 0.9rem;
    
    &:last-child {
      margin-bottom: 0;
    }
  }
`;

const NoResults = styled.div`
  grid-column: 1 / -1;
  text-align: center;
  padding: 40px 20px;
  color: #6c757d;
  
  svg {
    font-size: 3rem;
    margin-bottom: 16px;
    color: #e9ecef;
  }
  
  p {
    margin: 8px 0 0;
    font-size: 1.1rem;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 24px;
  border-radius: 8px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
`;

const ModalTitle = styled.h3`
  margin-top: 0;
  margin-bottom: 20px;
  color: #1a73e8;
`;

const ModalActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 24px;
`;

const Button = styled.button`
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  border: none;
  
  ${props => props.$primary && `
    background: #1a73e8;
    color: white;
    
    &:hover {
      background: #1557b0;
    }
  `}
  
  ${props => props.$secondary && `
    background: #6c757d;
    color: white;
    
    &:hover {
      background: #5a6268;
    }
  `}
  
  ${props => props.$danger && `
    background: #dc3545;
    color: white;
    
    &:hover {
      background: #bb2d3b;
    }
  `}
`;

const ErrorMessage = styled.div`
  color: #dc3545;
  background: #f8d7da;
  border: 1px solid #f5c6cb;
  padding: 10px 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  font-size: 0.95rem;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const SuccessMessage = styled(ErrorMessage)`
  color: #0f5132;
  background: #d1e7dd;
  border-color: #badbcc;
`;

export default function HistoricoPage() {
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [senha, setSenha] = useState('');
  const [reservaParaExcluir, setReservaParaExcluir] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  
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
      setLoading(true);
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          veiculos:veiculo_id (id, modelo, placa)
        `)
        .order('data_retirada', { ascending: false });
      
      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setError('Erro ao carregar o histórico de reservas.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReservas();
    
    // Buscar veículos para o dropdown
    const fetchVeiculos = async () => {
      try {
        const { data, error } = await supabase
          .from('veiculos')
          .select('id, modelo, placa')
          .order('modelo', { ascending: true });
        
        if (error) throw error;
        setVeiculos(data || []);
      } catch (error) {
        console.error('Erro ao buscar veículos:', error);
        setError('Erro ao carregar a lista de veículos');
      }
    };
    
    fetchVeiculos();
  }, []);

  const handleFiltroChange = (e) => {
    const { name, value } = e.target;
    setFiltro(prev => ({ ...prev, [name]: value }));
  };

  const formatarData = (dataString) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const reservasFiltradas = reservas
    .map(reserva => ({
      ...reserva,
      status: reserva.status_devolucao === 'Concluída' ? 'finalizada' : 'pendente'
    }))
    .filter(r => {
      const veiculoOk = !filtro.veiculo || r.veiculo_id === filtro.veiculo;
      const responsavelOk = !filtro.responsavel || 
        r.responsavel.toLowerCase().includes(filtro.responsavel.toLowerCase());
      const statusOk = !filtro.status || r.status === filtro.status;
      
      let dataOk = true;
      if (filtro.dataInicio) {
        dataOk = new Date(r.data_retirada) >= new Date(filtro.dataInicio);
      }
      if (dataOk && filtro.dataFim) {
        const dataFim = new Date(filtro.dataFim);
        dataFim.setHours(23, 59, 59); // Fim do dia
        dataOk = new Date(r.data_retirada) <= dataFim;
      }
      
      return veiculoOk && responsavelOk && statusOk && dataOk;
    });
    
  const limparFiltros = () => {
    setFiltro({
      veiculo: '',
      responsavel: '',
      status: '',
      dataInicio: '',
      dataFim: '',
    });
  };

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
    <Container>
      <Title>Histórico de Reservas</Title>
      
      <Section>
        <SectionHeader>
          <FaFilter />
          <span>Filtros</span>
        </SectionHeader>
        
        <FilterSection>
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Veículo</FilterLabel>
              <FilterSelect 
                name="veiculo" 
                value={filtro.veiculo} 
                onChange={handleFiltroChange}
              >
                <option value="">Todos os Veículos</option>
                {veiculos.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.modelo} {v.placa ? `(${v.placa})` : ''}
                  </option>
                ))}
              </FilterSelect>
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Responsável</FilterLabel>
              <FilterInput 
                type="text" 
                placeholder="Filtrar por responsável" 
                name="responsavel" 
                value={filtro.responsavel} 
                onChange={handleFiltroChange} 
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Status</FilterLabel>
              <FilterSelect 
                name="status" 
                value={filtro.status} 
                onChange={handleFiltroChange}
              >
                <option value="">Todos os Status</option>
                <option value="pendente">Pendente</option>
                <option value="finalizada">Finalizada</option>
              </FilterSelect>
            </FilterGroup>
          </FilterRow>
          
          <FilterRow>
            <FilterGroup>
              <FilterLabel>Data Inicial</FilterLabel>
              <FilterInput 
                type="date" 
                name="dataInicio" 
                value={filtro.dataInicio} 
                onChange={handleFiltroChange}
              />
            </FilterGroup>
            
            <FilterGroup>
              <FilterLabel>Data Final</FilterLabel>
              <FilterInput 
                type="date" 
                name="dataFim" 
                value={filtro.dataFim} 
                onChange={handleFiltroChange}
                min={filtro.dataInicio}
              />
            </FilterGroup>
            
            <FilterGroup style={{ display: 'flex', alignItems: 'flex-end' }}>
              <ResetButton onClick={limparFiltros}>
                <FaTimesCircle />
                Limpar Filtros
              </ResetButton>
            </FilterGroup>
          </FilterRow>
        </FilterSection>
      </Section>
      
      <Section>
        <SectionHeader>
          <FaCar />
          <span>Reservas {filtro.status === 'pendente' ? 'Pendentes' : filtro.status === 'finalizada' ? 'Finalizadas' : ''}</span>
          <span style={{ marginLeft: 'auto', fontSize: '0.9rem', opacity: 0.9 }}>
            {reservasFiltradas.length} {reservasFiltradas.length === 1 ? 'registro' : 'registros'} encontrados
          </span>
        </SectionHeader>
        
        {error && (
          <ErrorMessage>
            <FaTimesCircle />
            {error}
          </ErrorMessage>
        )}
        
        {success && (
          <SuccessMessage>
            <FaCheckCircle />
            {success}
          </SuccessMessage>
        )}
        
        {loading ? (
          <div style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
            Carregando reservas...
          </div>
        ) : reservasFiltradas.length === 0 ? (
          <NoResults>
            <FaSearch />
            <p>Nenhuma reserva encontrada</p>
            <p style={{ fontSize: '0.9rem', marginTop: '10px' }}>
              Tente ajustar os filtros para encontrar o que procura.
            </p>
          </NoResults>
        ) : (
          <ReservasGrid>
            {reservasFiltradas.map((reserva) => {
              const status = reserva.status_devolucao === 'Concluída' ? 'finalizada' : 'pendente';
              
              return (
                <ReservaCard key={reserva.id}>
                  <ReservaHeader $status={status}>
                    <VeiculoInfo>
                      {reserva.veiculos?.modelo || 'Veículo não encontrado'}
                      {reserva.veiculos?.placa && ` (${reserva.veiculos.placa})`}
                    </VeiculoInfo>
                    <StatusBadge $status={status}>
                      {status === 'finalizada' ? (
                        <>
                          <FaCheckCircle /> Finalizada
                        </>
                      ) : (
                        <>
                          <FaClock /> Pendente
                        </>
                      )}
                    </StatusBadge>
                  </ReservaHeader>
                  <ReservaBody>
                    <InfoRow>
                      <FaUser />
                      <span>{reserva.responsavel}</span>
                    </InfoRow>
                    
                    <InfoRow>
                      <FaBuilding />
                      <span>{reserva.departamento}</span>
                    </InfoRow>
                    
                    <InfoRow>
                      <FaCalendarAlt />
                      <DataInfo>
                        <div><strong>Retirada:</strong> {formatarData(reserva.data_retirada)}</div>
                        <div><strong>Devolução:</strong> {formatarData(reserva.data_devolucao_prevista)}</div>
                        {reserva.data_devolucao && (
                          <div><strong>Devolvido em:</strong> {formatarData(reserva.data_devolucao)}</div>
                        )}
                      </DataInfo>
                    </InfoRow>
                    
                    {reserva.observacoes && (
                      <InfoRow>
                        <FaInfoCircle />
                        <span>{reserva.observacoes}</span>
                      </InfoRow>
                    )}
                  </ReservaBody>
                </ReservaCard>
              );
            })}
          </ReservasGrid>
        )}
      </Section>
      
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirmar Exclusão</ModalTitle>
            
            <p>Tem certeza que deseja excluir esta reserva? Esta ação não pode ser desfeita.</p>
            
            <div style={{ margin: '20px 0' }}>
              <FilterLabel>Senha de Administrador</FilterLabel>
              <FilterInput 
                type="password" 
                value={senha} 
                onChange={(e) => setSenha(e.target.value)} 
                placeholder="Digite a senha"
              />
              {error && (
                <ErrorMessage style={{ marginTop: '10px' }}>
                  <FaTimesCircle />
                  {error}
                </ErrorMessage>
              )}
            </div>
            
            <ModalActions>
              <Button $secondary onClick={() => setShowModal(false)}>
                <FaTimesCircle />
                Cancelar
              </Button>
              <Button $danger onClick={handleConfirmDelete}>
                <FaTrash />
                Excluir
              </Button>
            </ModalActions>
          </ModalContent>
        </ModalOverlay>
      )}
    </Container>
  );
}
