import React, { useState, useEffect } from 'react';
import ReservaForm from '../components/ReservaForm';
import styled from 'styled-components';
import { supabase } from '../supabaseClient';
import { FaCar, FaUser, FaCalendarAlt, FaBuilding, FaInfoCircle } from 'react-icons/fa';

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
  background: #e6f4ea;
  color: #34a853;
  padding: 4px 12px;
  border-radius: 16px;
  font-size: 0.85rem;
  font-weight: 500;
`;

const ReservaBody = styled.div`
  padding: 16px;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 12px;
  font-size: 0.95rem;
  color: #555;
  
  svg {
    color: #1a73e8;
    margin-right: 10px;
    width: 16px;
    text-align: center;
  }
`;

export default function ReservaPage() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    fetchReservas();
  }, []);

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

  return (
    <Container>
      <Title>Reserva de Veículo</Title>
      
      <Section>
        <ReservaForm onReservaCreated={fetchReservas} />
      </Section>

      <Section>
        <SectionHeader>
          <FaCar />
          <span>Reservas Ativas</span>
        </SectionHeader>
        
        {loading ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
            Carregando reservas...
          </div>
        ) : reservas.length === 0 ? (
          <div style={{ padding: '24px', textAlign: 'center', color: '#666' }}>
            Nenhuma reserva ativa no momento.
          </div>
        ) : (
          <ReservasGrid>
            {reservas.map((reserva) => (
              <ReservaCard key={reserva.id}>
                <ReservaHeader>
                  <VeiculoInfo>
                    {reserva.veiculos?.modelo || 'Veículo não encontrado'}
                    {reserva.veiculos?.placa && ` (${reserva.veiculos.placa})`}
                  </VeiculoInfo>
                  <StatusBadge>Pendente</StatusBadge>
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
                    <div>
                      <div><strong>Retirada:</strong> {formatarData(reserva.data_retirada)}</div>
                      <div><strong>Devolução:</strong> {formatarData(reserva.data_devolucao_prevista)}</div>
                    </div>
                  </InfoRow>
                  {reserva.observacoes && (
                    <InfoRow>
                      <FaInfoCircle />
                      <span>{reserva.observacoes}</span>
                    </InfoRow>
                  )}
                </ReservaBody>
              </ReservaCard>
            ))}
          </ReservasGrid>
        )}
      </Section>
    </Container>
  );
}
