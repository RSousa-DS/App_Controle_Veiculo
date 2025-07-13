import React, { useState, useEffect } from 'react';
import ReservaForm from '../components/ReservaForm';
import styled, { keyframes } from 'styled-components';
import { supabase } from '../supabaseClient';
import { FaCar, FaUser, FaCalendarAlt, FaBuilding, FaInfoCircle, FaCheckCircle, FaClock, FaFileExport } from 'react-icons/fa';
import * as XLSX from 'xlsx';

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

// Estilos
const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Google Sans', 'Segoe UI', Roboto, Arial, sans-serif;
  color: ${colors.text};
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
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
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

const Section = styled.div`
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  margin-bottom: 24px;
  overflow: hidden;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${props => props.variant === 'primary' ? '#1a73e8' : '#f8f9fa'};
  color: ${props => props.variant === 'primary' ? 'white' : '#202124'};
  padding: 16px 24px;
  font-size: ${props => props.variant === 'primary' ? '1.2rem' : '1.1rem'};
  font-weight: 500;
  border-bottom: ${props => props.variant === 'secondary' ? '1px solid #e0e0e0' : 'none'};
  
  > div {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  
  button {
    display: flex;
    align-items: center;
    gap: 8px;
    background: ${props => props.variant === 'primary' ? '#fff' : '#1a73e8'};
    color: ${props => props.variant === 'primary' ? '#1a73e8' : 'white'};
    border: ${props => props.variant === 'primary' ? '1px solid #1a73e8' : 'none'};
    border-radius: 6px;
    padding: 8px 16px;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.2s;
    
    &:hover {
      background: ${props => props.variant === 'primary' ? '#f0f7ff' : '#1557b0'};
      transform: translateY(-1px);
    }
    
    &:active {
      transform: translateY(0);
    }
  }
`;

const ReservasGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmin(300px, 1fr));
  gap: 20px;
  padding: 24px;
`;

const ReservaCard = styled.div`
  border: 1px solid #e0e0e0;
  border-radius: 8px;
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
  
  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const ReservaHeader = styled.div`
  background: #f5f6fa;
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
  display: inline-block;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 12px;
  font-weight: 600;
  background-color: ${props => {
    switch(props.$status) {
      case 'Finalizada':
        return colors.successLight;
      case 'Cancelada':
        return colors.errorLight;
      case 'Pendente':
      default:
        return colors.warningLight;
    }
  }};
  color: ${props => {
    switch(props.$status) {
      case 'Finalizada':
        return colors.success;
      case 'Cancelada':
        return colors.error;
      case 'Pendente':
      default:
        return colors.warning;
    }
  }};
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin: 0;
  font-size: 0.9rem;
  background: ${colors.white};
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  
  th, td {
    padding: 12px 16px;
    text-align: left;
    border-bottom: 1px solid ${colors.border};
  }
  
  th {
    background-color: ${colors.primaryLight};
    color: ${colors.primary};
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
  }
  
  tr:last-child td {
    border-bottom: none;
  }
  
  tr:hover {
    background-color: ${colors.gray50};
  }
  
  @media (max-width: 768px) {
    th, td {
      padding: 10px 8px;
      font-size: 0.85rem;
    }
    
    th {
      display: none;
    }
    
    tr {
      display: block;
      margin-bottom: 16px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
    }
    
    td {
      display: flex;
      justify-content: space-between;
      text-align: right;
      padding: 8px 16px;
      border-bottom: 1px solid ${colors.gray200};
    }
    
    td::before {
      content: attr(data-label);
      font-weight: 600;
      color: ${colors.textSecondary};
      margin-right: 16px;
      text-transform: uppercase;
      font-size: 0.7rem;
    }
  }
`;

const StatsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 24px;
  margin-bottom: 24px;
`;

const StatCard = styled.div`
  background: ${colors.white};
  border-radius: 16px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  gap: 16px;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  }
`;

const StatIcon = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  background-color: ${props => props.bgColor || colors.primaryLight};
  color: ${props => props.color || colors.primary};
`;

const StatContent = styled.div`
  flex: 1;
`;

const StatLabel = styled.div`
  font-size: 14px;
  color: ${colors.textSecondary};
  margin-bottom: 4px;
`;

const StatNumber = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: ${colors.text};
`;

export default function ReservaPage() {
  const [reservas, setReservas] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    finalizadas: 0,
    emAndamento: 0,
    atrasadas: 0
  });
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          veiculos:veiculo_id (modelo, placa)
        `)
        .eq('status_devolucao', 'Pendente')
        .order('data_retirada', { ascending: true });
      
      if (error) throw error;
      setReservas(data || []);
    } catch (error) {
      console.error('Erro ao buscar reservas:', error);
      setReservas([]);
    } finally {
      setLoading(false);
    }
  };

  const exportToExcel = () => {
    // Preparar os dados para exportação
    const dadosParaExportar = reservas.map(reserva => ({
      'Veículo': reserva.veiculos?.modelo || 'Não informado',
      'Placa': reserva.veiculos?.placa || 'Não informada',
      'Responsável': reserva.responsavel,
      'Departamento': reserva.departamento,
      'Retirada': formatarData(reserva.data_retirada, true),
      'Devolução Prevista': formatarData(reserva.data_devolucao_prevista, true),
      'Status': reserva.status_devolucao === 'Pendente' ? 'Em Andamento' : 'Finalizada'
    }));

    // Criar uma nova planilha
    const ws = XLSX.utils.json_to_sheet(dadosParaExportar);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Reservas');
    
    // Gerar o arquivo Excel
    XLSX.writeFile(wb, `reservas_${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const fetchStats = async () => {
    try {
      setLoadingStats(true);
      const now = new Date().toISOString();
      
      // Buscar total de reservas
      const { count: totalReservas } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true });
      
      // Buscar reservas finalizadas
      const { count: finalizadas } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('status_devolucao', 'Concluído');
      
      // Buscar reservas em andamento (não finalizadas e não atrasadas)
      const { count: emAndamento } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('status_devolucao', 'Pendente')
        .gt('data_devolucao_prevista', now);
      
      // Buscar reservas atrasadas (data de devolução prevista menor que agora e status Pendente)
      const { count: atrasadas } = await supabase
        .from('reservas')
        .select('*', { count: 'exact', head: true })
        .eq('status_devolucao', 'Pendente')
        .lt('data_devolucao_prevista', now);
      
      setStats({
        total: totalReservas || 0,
        finalizadas: finalizadas || 0,
        emAndamento: emAndamento || 0,
        atrasadas: atrasadas || 0
      });
    } catch (error) {
      console.error('Erro ao buscar estatísticas de reservas:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  useEffect(() => {
    fetchReservas();
    fetchStats();
  }, []);

  // Função para formatar datas
  const formatarData = (dataString, paraExportacao = false) => {
    if (!dataString) return '-';
    const data = new Date(dataString);
    
    if (paraExportacao) {
      return data.toLocaleString('pt-BR');
    }
    
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Container>
      <Banner>
        <BannerIcon>
          <FaCar />
        </BannerIcon>
        <BannerTitle>Reserva de Veículos</BannerTitle>
      </Banner>
      
      <Section>
        <ReservaForm onReservaCreated={fetchReservas} />
      </Section>

      <Section>
        <SectionHeader>
          <div>
            <FaCalendarAlt />
            <span>Visão Geral das Reservas</span>
          </div>
          <button onClick={exportToExcel}>
            <FaFileExport />
            Exportar Dados
          </button>
        </SectionHeader>
        
        <StatsContainer>
          <StatCard>
            <StatIcon bgColor="rgba(26, 115, 232, 0.1)" color="#1a73e8">
              <FaCalendarAlt />
            </StatIcon>
            <StatContent>
              <StatLabel>Total de Reservas</StatLabel>
              <StatNumber>{loadingStats ? '-' : stats.total.toLocaleString()}</StatNumber>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="rgba(52, 168, 83, 0.1)" color="#34a853">
              <FaCheckCircle />
            </StatIcon>
            <StatContent>
              <StatLabel>Reservas Finalizadas</StatLabel>
              <StatNumber>{loadingStats ? '-' : stats.finalizadas.toLocaleString()}</StatNumber>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="rgba(249, 171, 0, 0.1)" color="#f9ab00">
              <FaClock />
            </StatIcon>
            <StatContent>
              <StatLabel>Reservas em Andamento</StatLabel>
              <StatNumber>{loadingStats ? '-' : stats.emAndamento.toLocaleString()}</StatNumber>
            </StatContent>
          </StatCard>
          
          <StatCard>
            <StatIcon bgColor="rgba(220, 53, 69, 0.1)" color="#dc3545">
              <FaClock />
            </StatIcon>
            <StatContent>
              <StatLabel>Reservas Atrasadas</StatLabel>
              <StatNumber>{loadingStats ? '-' : stats.atrasadas.toLocaleString()}</StatNumber>
            </StatContent>
          </StatCard>
        </StatsContainer>
      </Section>

      <Section>
        <SectionHeader>
          <FaCar />
          <span>Reservas Ativas</span>
        </SectionHeader>
        
        <div style={{ overflowX: 'auto' }}>
          <StyledTable>
            <thead>
              <tr>
                <th>Veículo</th>
                <th>Responsável</th>
                <th>Departamento</th>
                <th>Data Retirada</th>
                <th>Data Devolução</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Carregando reservas...</td>
                </tr>
              ) : reservas.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>Nenhuma reserva ativa no momento.</td>
                </tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva.id}>
                    <td data-label="Veículo">
                      {reserva.veiculos?.modelo || 'Veículo não encontrado'}
                      {reserva.veiculos?.placa && ` (${reserva.veiculos.placa})`}
                    </td>
                    <td data-label="Responsável">{reserva.responsavel}</td>
                    <td data-label="Departamento">{reserva.departamento}</td>
                    <td data-label="Data Retirada">{formatarData(reserva.data_retirada, true)}</td>
                    <td data-label="Data Devolução">{formatarData(reserva.data_devolucao_prevista, true)}</td>
                    <td data-label="Status">
                      <StatusBadge $status="Pendente">Pendente</StatusBadge>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </StyledTable>
        </div>
      </Section>
    </Container>
  );
}
