import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes } from 'styled-components';
import * as XLSX from 'xlsx';
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
  FaClock,
  FaHistory,
  FaUserShield,
  FaFileExcel,
  FaExclamationTriangle
} from 'react-icons/fa';

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
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
  
  ${({ $status }) => {
    switch($status) {
      case 'finalizada':
        return `
          background-color: ${colors.success}20;
          color: ${colors.success};
        `;
      case 'pendente':
        return `
          background-color: ${colors.warning}20;
          color: ${colors.warning};
        `;
      default:
        return `
          background-color: ${colors.gray200};
          color: ${colors.textSecondary};
        `;
    }
  }}
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
  // Estados
  const [reservas, setReservas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [senha, setSenha] = useState('');
  const [reservaParaExcluir, setReservaParaExcluir] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);
  const { user, isAdmin } = useAuth();
  
  const [filtro, setFiltro] = useState({
    veiculo: '',
    responsavel: '',
    status: '',
    dataInicio: '',
    dataFim: '',
  });
  
  const [veiculos, setVeiculos] = useState([]);
  
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
  
  // Função para exportar dados para XLSX
  const exportToExcel = () => {
    try {
      // Garante que temos um array válido para exportação
      const dadosParaExportar = Array.isArray(reservasComKm) ? reservasComKm : [];
      
      // Preparar os dados para exportação
      const dataToExport = dadosParaExportar.map(reserva => {
        // Verifica se é uma reserva concluída para mostrar data de devolução real
        const dataDevolucao = reserva.status_devolucao === 'Concluído' && reserva.data_devolucao_real
          ? formatarData(reserva.data_devolucao_real, true)
          : (reserva.data_devolucao_prevista ? formatarData(reserva.data_devolucao_prevista, true) : 'Pendente');
        
        // Obtém o KM Percorrido já calculado
        const kmPercorrido = reserva.kmPercorrido !== 'N/A' 
          ? Number(reserva.kmPercorrido) 
          : 'N/A';
        
        return {
          'ID': reserva.id,
          'Veículo': reserva.veiculos?.modelo || 'N/A',
          'Placa': reserva.veiculos?.placa || 'N/A',
          'Responsável': reserva.responsavel || 'N/A',
          'Usuário Solicitante': reserva.nomeUsuario || 'N/A',
          'E-mail': reserva.email || 'N/A',
          'Departamento': reserva.departamento || 'N/A',
          'Data Retirada': formatarData(reserva.data_retirada, true),
          'Data Devolução Prevista': reserva.data_devolucao_prevista ? formatarData(reserva.data_devolucao_prevista, true) : 'N/A',
          'Data Devolução Real': reserva.data_devolucao_real ? formatarData(reserva.data_devolucao_real, true) : 'Pendente',
          'Status': reserva.status_devolucao || 'Pendente',
          'KM Devolvido': reserva.km_devolvido || 'N/A',
          'KM Percorrido': kmPercorrido,
          'Local Estacionado': reserva.local_estacionado || 'N/A',
          'Observações': reserva.observacoes || 'N/A',
          'Data Criação': reserva.data_criacao ? formatarData(reserva.data_criacao, true) : 'N/A',
          'Data Atualização': reserva.data_atualizacao ? formatarData(reserva.data_atualizacao, true) : 'N/A'
        };
      });

      // Criar planilha
      const ws = XLSX.utils.json_to_sheet(dataToExport);

      // Ajustar largura das colunas
      const wscols = [
        { wch: 8 },   // ID
        { wch: 20 },  // Veículo
        { wch: 12 },  // Placa
        { wch: 25 },  // Responsável
        { wch: 25 },  // Usuário Solicitante
        { wch: 25 },  // E-mail
        { wch: 20 },  // Departamento
        { wch: 20 },  // Data Retirada
        { wch: 25 },  // Data Devolução Prevista
        { wch: 25 },  // Data Devolução Real
        { wch: 15 },  // Status
        { wch: 15 },  // KM Devolvido
        { wch: 15 },  // KM Percorrido
        { wch: 20 },  // Local Estacionado
        { wch: 40 },  // Observações
        { wch: 25 },  // Data Criação
        { wch: 25 }   // Data Atualização
      ];
      ws['!cols'] = wscols;

      // Criar livro de trabalho
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Histórico de Reservas');

      // Gerar arquivo
      const fileName = `historico_reservas_${new Date().toISOString().split('T')[0]}.xlsx`;
      XLSX.writeFile(wb, fileName);

      setSuccess('Exportação concluída com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Erro ao exportar para Excel:', error);
      setError('Erro ao exportar para Excel. Tente novamente.');
      setTimeout(() => setError(''), 5000);
    }
  };

  const fetchReservas = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservas')
        .select(`
          *,
          veiculos:veiculo_id (id, modelo, placa),
          usuarios!fk_usuario(id, nome)
        `)
        .order('data_retirada', { ascending: false });

      if (error) throw error;
      
      // Adiciona o nome do usuário a cada reserva
      const reservasComUsuario = data.map(reserva => ({
        ...reserva,
        nomeUsuario: reserva.usuarios?.nome || 'Usuário não encontrado'
      }));
      
      setReservas(reservasComUsuario || []);
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
          .eq('ativo', true)
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

  const reservasFiltradas = reservas
    .map(reserva => ({
      ...reserva,
      status: reserva.status_devolucao?.toLowerCase() === 'concluido' || reserva.status_devolucao === 'Concluído' ? 'finalizada' : 'pendente'
    }))
    .filter(r => {
      // Converte ambos os lados para número para garantir a comparação correta
      const veiculoOk = !filtro.veiculo || Number(r.veiculo_id) === Number(filtro.veiculo);
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

  // Função auxiliar para verificar e converter valores de KM
  const parseKmValue = (value) => {
    if (value === null || value === undefined || value === '') return null;
    const num = Number(value);
    return !isNaN(num) && isFinite(num) ? num : null;
  };

  // Filtrar apenas reservas com veículo e km_devolvido preenchido
  const reservasComKmPreenchido = reservasFiltradas
    .filter(r => r.veiculo_id && r.km_devolvido !== null && r.km_devolvido !== undefined)
    .sort((a, b) => new Date(a.data_retirada) - new Date(b.data_retirada)); // Ordenar por data_retirada

  // Agrupar por veículo
  const reservasPorVeiculo = reservasComKmPreenchido.reduce((acc, reserva) => {
    const veiculoId = reserva.veiculo_id;
    if (!acc[veiculoId]) {
      acc[veiculoId] = [];
    }
    acc[veiculoId].push(reserva);
    return acc;
  }, {});

  // Calcular KM Percorrido para cada reserva
  const reservasComKm = reservasFiltradas.map(reserva => {
    const veiculoId = reserva.veiculo_id;
    const kmAtual = parseKmValue(reserva.km_devolvido);
    
    // Se não tiver km_devolvido, retorna N/A
    if (kmAtual === null) {
      return {
        ...reserva,
        kmPercorrido: 'N/A',
        _debug: {
          kmAtual: null,
          kmAnterior: null,
          kmPercorrido: null,
          status: reserva.status_devolucao?.toLowerCase() === 'concluido' ? 'concluido' : 'pendente'
        }
      };
    }
    
    // Encontra todas as reservas anteriores para este veículo
    const reservasAnteriores = (reservasPorVeiculo[veiculoId] || [])
      .filter(r => new Date(r.data_retirada) < new Date(reserva.data_retirada));
    
    // Ordena por data_retirada decrescente para pegar a mais recente
    reservasAnteriores.sort((a, b) => new Date(b.data_retirada) - new Date(a.data_retirada));
    
    // Pega o km_devolvido da reserva anterior mais recente, se existir
    const reservaAnterior = reservasAnteriores[0];
    const kmAnterior = reservaAnterior ? parseKmValue(reservaAnterior.km_devolvido) : null;
    
    // Calcula o km percorrido (só se tiver reserva anterior com km válido)
    const kmPercorrido = kmAnterior !== null ? kmAtual - kmAnterior : null;
    
    console.group(`Reserva ID: ${reserva.id}`);
    console.log('Veículo:', veiculoId);
    console.log('Data Retirada:', reserva.data_retirada);
    console.log('KM Atual (devolvido):', kmAtual);
    console.log('KM Anterior:', kmAnterior);
    console.log('KM Percorrido:', kmPercorrido);
    console.groupEnd();
    
    return {
      ...reserva,
      kmPercorrido: kmPercorrido !== null ? kmPercorrido.toString() : 'N/A',
      _debug: {
        kmAtual,
        kmAnterior,
        kmPercorrido,
        status: reserva.status_devolucao?.toLowerCase() === 'concluido' ? 'concluido' : 'pendente',
        dataRetirada: reserva.data_retirada,
        reservaAnteriorId: reservaAnterior?.id || null
      }
    };
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

  const handleDeleteClick = async (reserva) => {
    console.log('Iniciando exclusão da reserva:', reserva.id);
    console.log('Usuário logado:', user);
    console.log('É admin?', isAdmin);
    
    if (!isAdmin) {
      const errorMsg = 'Apenas administradores podem excluir reservas.';
      console.error(errorMsg);
      setError(errorMsg);
      return;
    }
    
    try {
      // Verifica se o usuário é realmente admin
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('perfil')
        .eq('email', user?.email || '')
        .single();
        
      console.log('Dados do usuário do banco:', { userData, userError });
      
      if (userError) throw userError;
      
      if (userData?.perfil !== 'admin') {
        const errorMsg = 'Acesso negado. Você não tem permissão para excluir reservas.';
        console.error(errorMsg);
        setError(errorMsg);
        return;
      }
      
      setReservaParaExcluir(reserva);
      setSenha('');
      setError('');
      setSuccess('');
      setShowModal(true);
      
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setError('Erro ao verificar permissões. Tente novamente.');
    }
  };

  const handleConfirmDelete = async () => {
    if (!isAdmin) {
      setError('Apenas administradores podem excluir reservas.');
      return;
    }

    try {
      console.log('Iniciando exclusão da reserva ID:', reservaParaExcluir.id);
      
      // Verifica se a reserva existe antes de tentar excluir
      console.log('Verificando existência da reserva...');
      const { data: reservaExistente, error: checkError } = await supabase
        .from('reservas')
        .select('id')
        .eq('id', reservaParaExcluir.id)
        .single();
      
      if (checkError) {
        console.error('Erro ao verificar reserva:', checkError);
        throw new Error('Erro ao verificar a reserva. Tente novamente.');
      }
      
      if (!reservaExistente) {
        throw new Error('Reserva não encontrada. Ela pode já ter sido excluída.');
      }
      
      console.log('Reserva encontrada, verificando restrições...');
      
      // Verifica se há restrições de chave estrangeira
      console.log('Verificando restrições de chave estrangeira...');
      const { data: constraints, error: constraintsError } = await supabase
        .rpc('get_foreign_key_constraints', { table_name: 'reservas' });
      
      if (constraintsError) {
        console.warn('Não foi possível verificar restrições de chave estrangeira:', constraintsError);
      } else if (constraints && constraints.length > 0) {
        console.log('Restrições de chave estrangeira encontradas:', constraints);
        // Verifica se há registros dependentes
        for (const constraint of constraints) {
          const { data: dependentData, error: dependentError } = await supabase
            .from(constraint.foreign_table_name)
            .select('*')
            .eq(constraint.foreign_column_name, reservaParaExcluir.id)
            .limit(1);
            
          if (dependentError) {
            console.error(`Erro ao verificar tabela ${constraint.foreign_table_name}:`, dependentError);
          } else if (dependentData && dependentData.length > 0) {
            throw new Error(`Não é possível excluir esta reserva pois existem registros relacionados na tabela ${constraint.foreign_table_name}.`);
          }
        }
      }
      
      console.log('Nenhuma restrição de chave estrangeira encontrada, prosseguindo com a exclusão...');
      
      // Tenta excluir a reserva
      console.log('Enviando requisição de exclusão...');
      const { data, error } = await supabase
        .from('reservas')
        .delete()
        .eq('id', reservaParaExcluir.id)
        .select();

      console.log('Resposta da exclusão:', { data, error });
      
      if (error) {
        console.error('Erro na resposta da exclusão:', error);
        throw error;
      }
      
      console.log('Reserva excluída com sucesso!');

      // Atualiza a lista de reservas
      await fetchReservas();
      setShowModal(false);
      
      // Mostra mensagem de sucesso
      setSuccess('Reserva excluída com sucesso!');
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (error) {
      console.error('Erro ao excluir reserva:', {
        message: error.message,
        code: error.code,
        details: error.details,
        hint: error.hint,
        error: error
      });
      
      // Mensagens de erro mais amigáveis
      let errorMessage = 'Erro ao excluir reserva. ';
      
      if (error.code === '23503') {
        errorMessage += 'Não é possível excluir esta reserva pois existem registros relacionados a ela.';
      } else if (error.code === '42P01') {
        errorMessage += 'Tabela não encontrada. Verifique a conexão com o banco de dados.';
      } else if (error.message.includes('permission denied')) {
        errorMessage += 'Permissão negada. Verifique suas credenciais de administrador.';
      } else {
        errorMessage += error.message || 'Tente novamente mais tarde.';
      }
      
      setError(errorMessage);
    }
  };

  const StyledTable = styled.table`
    width: 100%;
    border-collapse: collapse;
    margin: 0;
    font-size: 0.9rem;
    background: ${colors.white};
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);

    th, td {
      padding: 12px 16px;
      text-align: left;
      border-bottom: 1px solid ${colors.border};
    }

    th {
      background-color: ${colors.primary};
      color: white;
      font-weight: 500;
      text-transform: uppercase;
      font-size: 0.8rem;
      letter-spacing: 0.5px;
    }

    tr:last-child td {
      border-bottom: none;
    }

    tr:hover {
      background-color: ${colors.gray50};
    }

    @media (max-width: 768px) {
      display: block;

      thead {
        display: none;
      }

      tbody, tr, td {
        display: block;
        width: 100%;
      }

      tr {
        margin-bottom: 16px;
        border: 1px solid ${colors.border};
        border-radius: 8px;
        overflow: hidden;
      }

      td {
        display: flex;
        justify-content: space-between;
        align-items: center;
        text-align: right;
        padding-left: 50%;
        position: relative;
        border-bottom: 1px solid ${colors.border};
      }

      td:before {
        content: attr(data-label);
        position: absolute;
        left: 16px;
        width: 45%;
        padding-right: 10px;
        text-align: left;
        font-weight: 500;
        color: ${colors.text};
      }

      td:last-child {
        border-bottom: none;
      }
    }
  `;

  const StatusBadge = styled.span`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 10px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;

    ${({ $status }) => {
      switch ($status) {
        case 'finalizada':
          return `
            background-color: ${colors.success}20;
            color: ${colors.success};
          `;
        case 'pendente':
          return `
            background-color: ${colors.warning}20;
            color: ${colors.warning};
          `;
        case 'atrasada':
          return `
            background-color: ${colors.danger}20;
            color: ${colors.danger};
          `;
        default:
          return `
            background-color: ${colors.gray200};
            color: ${colors.text};
          `;
      }
    }}
  `;

  return (
    <Container>
      <Banner>
        <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
          <BannerIcon>
            <FaHistory />
          </BannerIcon>
          <BannerTitle>Histórico de Reservas</BannerTitle>
        </div>
        <Button
          onClick={exportToExcel}
          style={{
            backgroundColor: colors.success,
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            '&:hover': {
              backgroundColor: '#2e7d32'
            }
          }}
        >
          <FaFileExcel />
          Exportar para Excel
        </Button>
      </Banner>
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
          <div style={{ overflowX: 'auto' }}>
            <StyledTable>
              <thead>
                <tr>
                  <th>Veículo</th>
                  <th>Responsável</th>
                  <th>Usuário</th>
                  <th>Departamento</th>
                  <th>Retirada</th>
                  <th>Devolução</th>
                  <th>Status</th>
                  <th>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      KM Percorrido
                      <div
                        style={{
                          position: 'relative',
                          display: 'inline-flex',
                          alignItems: 'center',
                          cursor: 'help'
                        }}
                        title="Distância percorrida (em KM) desde a última devolução do veículo. Calculado automaticamente com base no KM atual e do último registro de devolução."
                      >
                        <FaInfoCircle size={14} style={{ opacity: 0.7 }} />
                      </div>
                    </div>
                  </th>
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {Array.isArray(reservasComKm) && reservasComKm.map((reserva) => {
                  const status = reserva.status_devolucao === 'concluido' || reserva.status_devolucao === 'Concluído' ? 'finalizada' : 'pendente';
                  const dataAtual = new Date();
                  const dataDevolucao = new Date(reserva.data_devolucao_prevista);
                  const atrasada = status === 'pendente' && dataAtual > dataDevolucao;

                  return (
                    <tr key={reserva.id}>
                      <td data-label="Veículo">
                        <div style={{ fontWeight: 500 }}>{reserva.veiculos?.modelo || 'Veículo não encontrado'}</div>
                        {reserva.veiculos?.placa && (
                          <div style={{ fontSize: '0.85rem', color: colors.textSecondary }}>
                            {reserva.veiculos.placa}
                          </div>
                        )}
                      </td>
                      <td data-label="Responsável">
                        {reserva.responsavel}
                      </td>
                      <td data-label="Usuário Solicitante">
                        {reserva.nomeUsuario}
                      </td>
                      <td data-label="Departamento">
                        {reserva.departamento}
                      </td>
                      <td data-label="Retirada">
                        {formatarData(reserva.data_retirada)}
                      </td>
                      <td data-label="Devolução">
                        <div>{formatarData(reserva.data_devolucao_real)}</div>
                        {reserva.data_devolucao && (
                          <div style={{ fontSize: '0.85rem', color: colors.textSecondary }}>
                            Devolvido: {formatarData(reserva.data_devolucao)}
                          </div>
                        )}
                      </td>
                      <td data-label="Status">
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
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
                          {atrasada && (
                            <StatusBadge $status="atrasada">
                              Atrasada
                            </StatusBadge>
                          )}
                        </div>
                      </td>
                      <td data-label="KM Percorrido" style={{ textAlign: 'center' }}>
                        {reserva.kmPercorrido !== 'N/A' ? (
                          <div
                            style={{
                              fontWeight: '500',
                              color: reserva._debug.kmPercorrido < 0 ? colors.danger :
                                reserva._debug.kmPercorrido > 1000 ? colors.warning : 'inherit',
                              position: 'relative',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px'
                            }}
                            title={
                              reserva._debug.kmPercorrido < 0 ? 
                                'Valor inválido: KM atual menor que KM anterior' :
                                `KM Anterior: ${reserva._debug.kmAnterior || 'N/A'}`
                            }
                          >
                            {reserva.kmPercorrido} km
                            {reserva._debug.kmPercorrido < 0 && (
                              <FaExclamationTriangle style={{ color: colors.danger }} />
                            )}
                          </div>
                        ) : 'N/A'}
                      </td>
                      <td data-label="Ações">
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {(reserva.status_devolucao?.toLowerCase() !== 'concluido' && reserva.status_devolucao !== 'Concluído') && (
                            <div style={{ display: 'flex', gap: '8px' }}>
                              {isAdmin && (
                                <button 
                                  onClick={() => handleDeleteClick(reserva)}
                                  style={{
                                    background: 'none',
                                    border: 'none',
                                    color: colors.danger,
                                    cursor: 'pointer',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 8px',
                                    borderRadius: '4px',
                                    transition: 'all 0.2s'
                                  }}
                                  onMouseOver={(e) => e.target.style.backgroundColor = colors.gray200}
                                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                                  title="Excluir reserva (apenas administradores)"
                                >
                                  <FaTrash /> Excluir
                                </button>
                              )}
                              {!isAdmin && (
                                <span 
                                  style={{
                                    color: colors.textSecondary,
                                    fontSize: '0.8rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '4px',
                                    padding: '4px 8px',
                                    cursor: 'not-allowed',
                                    opacity: 0.7
                                  }}
                                  title="Apenas administradores podem excluir reservas"
                                >
                                  <FaUserShield /> Acesso restrito
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </StyledTable>
          </div>
        )}
      </Section>
      
      {showModal && (
        <ModalOverlay>
          <ModalContent>
            <ModalTitle>Confirmar Exclusão</ModalTitle>
            
            <p>Tem certeza que deseja excluir a reserva do veículo <strong>{reservaParaExcluir?.veiculos?.modelo || 'N/A'}</strong>?</p>
            <p style={{ color: colors.danger, margin: '10px 0' }}>
              <FaExclamationTriangle style={{ marginRight: '8px' }} />
              Esta ação não pode ser desfeita.
            </p>
            
            <div style={{ margin: '20px 0', padding: '15px', backgroundColor: colors.gray100, borderRadius: '8px' }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                <FaUserShield style={{ color: colors.primary, marginRight: '10px', fontSize: '1.2rem' }} />
                <strong>Confirmação de Administrador</strong>
              </div>
              <p style={{ fontSize: '0.9rem', color: colors.textSecondary, margin: '5px 0' }}>
                Usuário: <strong>{user?.email || 'N/A'}</strong>
              </p>
              <p style={{ fontSize: '0.9rem', color: colors.textSecondary, margin: '5px 0' }}>
                Perfil: <strong>Administrador</strong>
              </p>
              
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
