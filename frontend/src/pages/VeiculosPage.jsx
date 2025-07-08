import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import styled, { keyframes, css } from 'styled-components';
import { FaCar, FaPlus, FaEdit, FaSave, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Design system colors
const colors = {
  primary: '#1a73e8',
  primaryDark: '#155ab6',
  success: '#34a853',
  successLight: '#e6f4ea',
  danger: '#ea4335',
  dangerLight: '#fce8e6',
  warning: '#fbbc04',
  warningLight: '#fff7e0',
  text: '#222',
  textSecondary: '#555',
  border: '#e0e0e0',
  gray50: '#f5f6fa',
  background: '#fff',
};

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const Banner = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  background: ${colors.primary};
  color: #fff;
  padding: 28px 24px 18px 24px;
  border-radius: 12px 12px 0 0;
  font-size: 1.7rem;
  font-weight: 500;
  box-shadow: 0 2px 8px rgba(26,115,232,0.08);
`;

const MainContainer = styled.div`
  background: ${colors.background};
  max-width: 700px;
  margin: 36px auto 0 auto;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(26,115,232,0.08);
  overflow: hidden;
  animation: ${fadeIn} 0.4s;
`;

const FormSection = styled.form`
  padding: 32px 24px 16px 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

const FieldGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 18px;
`;
const Field = styled.div`
  flex: 1 1 220px;
  display: flex;
  flex-direction: column;
`;
const Label = styled.label`
  font-weight: 500;
  color: ${colors.textSecondary};
  margin-bottom: 5px;
`;
const Input = styled.input`
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: #fafbfc;
  transition: border 0.2s;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;
const Textarea = styled.textarea`
  min-height: 38px;
  padding: 8px 12px;
  border: 1px solid ${colors.border};
  border-radius: 6px;
  font-size: 1rem;
  background: #fafbfc;
  resize: vertical;
  transition: border 0.2s;
  &:focus {
    outline: none;
    border-color: ${colors.primary};
  }
`;
const Button = styled.button`
  background: ${({ $variant }) =>
    $variant === 'success' ? colors.success :
    $variant === 'danger' ? colors.danger :
    colors.primary};
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 18px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background 0.2s, box-shadow 0.2s;
  box-shadow: 0 1px 4px rgba(26,115,232,0.07);
  display: flex;
  align-items: center;
  gap: 8px;
  &:hover {
    background: ${({ $variant }) =>
      $variant === 'success' ? colors.primary :
      $variant === 'danger' ? '#b3261e' :
      colors.primaryDark};
  }
`;
const TableSection = styled.div`
  padding: 0 24px 24px 24px;
`;
const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
`;
const Th = styled.th`
  background: ${colors.primary};
  color: #fff;
  font-weight: 500;
  padding: 10px 6px;
  font-size: 1rem;
  border: none;
`;
const Td = styled.td`
  padding: 10px 6px;
  font-size: 0.97rem;
  color: ${colors.text};
  border-bottom: 1px solid ${colors.border};
`;
const StatusBadge = styled.span`
  background: ${colors.successLight};
  color: ${colors.success};
  padding: 3px 10px;
  border-radius: 16px;
  font-size: 0.9rem;
  font-weight: 500;
`;
const Message = styled.div`
  margin: 10px 0 0 0;
  padding: 12px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1rem;
  font-weight: 500;
  ${({ type }) => type === 'success' && css`
    background: ${colors.successLight}; color: ${colors.success};
  `}
  ${({ type }) => type === 'error' && css`
    background: ${colors.dangerLight}; color: ${colors.danger};
  `}
`;

export default function VeiculosPage() {
  const [veiculos, setVeiculos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ modelo: '', placa: '', km_inicial: '', km_locada: '', cidade: '', locadora: '', observacoes: '' });
  const { user } = useAuth();
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch vehicles from Supabase
  const fetchVeiculos = async () => {
    setLoading(true);
    const { data, error } = await supabase.from('veiculos').select('*').order('created_at', { ascending: false });
    if (error) {
      setVeiculos([]);
    } else {
      setVeiculos(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchVeiculos();
  }, []);

  // Form handlers
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
    setFormError('');
    setFormSuccess('');
  };

  const validateForm = () => {
    if (!form.modelo.trim()) {
      setFormError('O modelo do veículo é obrigatório.');
      return false;
    }
    return true;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    if (!validateForm()) return;
    setIsSubmitting(true);
    if (!user) {
      setFormError('Você precisa estar logado para cadastrar um veículo.');
      return;
    }

    const payload = {
      modelo: form.modelo.trim(),
      placa: form.placa.trim() || null,
      km_inicial: form.km_inicial ? parseInt(form.km_inicial) : null,
      km_locada: form.km_locada ? parseInt(form.km_locada) : null,
      cidade: form.cidade.trim() || null,
      locadora: form.locadora.trim() || null,
      observacoes: form.observacoes.trim() || null,
      created_by: user.id,
      updated_by: user.id
    };
    const { error } = await supabase.from('veiculos').insert([payload]);
    if (error) {
      setFormError('Erro ao cadastrar veículo.');
    } else {
      setFormSuccess('Veículo cadastrado com sucesso!');
      setForm({ modelo: '', placa: '', km_inicial: '', km_locada: '', cidade: '', locadora: '', observacoes: '' });
      fetchVeiculos();
    }
    setIsSubmitting(false);
  };

  return (
    <MainContainer>
      <Banner>
        <FaCar /> Cadastro de Veículos
      </Banner>
      <FormSection onSubmit={handleSubmit} autoComplete="off">
        <FieldGroup>
          <Field>
            <Label>Modelo do Veículo *</Label>
            <Input name="modelo" value={form.modelo} onChange={handleChange} required maxLength={120} />
          </Field>
          <Field>
            <Label>Placa</Label>
            <Input name="placa" value={form.placa} onChange={handleChange} maxLength={16} />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Label>Km Inicial</Label>
            <Input name="km_inicial" value={form.km_inicial} onChange={handleChange} type="number" min={0} max={9999999} />
          </Field>
          <Field>
            <Label>Km Locada</Label>
            <Input name="km_locada" value={form.km_locada} onChange={handleChange} type="number" min={0} max={9999999} />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field>
            <Label>Cidade</Label>
            <Input name="cidade" value={form.cidade} onChange={handleChange} maxLength={80} />
          </Field>
          <Field>
            <Label>Locadora</Label>
            <Input name="locadora" value={form.locadora} onChange={handleChange} maxLength={80} />
          </Field>
        </FieldGroup>
        <FieldGroup>
          <Field style={{ flex: '2 1 100%' }}>
            <Label>Observação</Label>
            <Textarea name="observacoes" value={form.observacoes} onChange={handleChange} maxLength={300} />
          </Field>
        </FieldGroup>
        {formError && <Message type="error"><FaExclamationCircle /> {formError}</Message>}
        {formSuccess && <Message type="success"><FaCheckCircle /> {formSuccess}</Message>}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
          <Button type="submit" disabled={isSubmitting}>
            <FaPlus /> {isSubmitting ? 'Salvando...' : 'Cadastrar Veículo'}
          </Button>
        </div>
      </FormSection>
      <TableSection>
        <h3 style={{ color: colors.primary, fontWeight: 500, margin: '6px 0 0 0', fontSize: '1.2rem' }}>Veículos Cadastrados</h3>
        <StyledTable>
          <thead>
            <tr>
              <Th>Modelo</Th>
              <Th>Placa</Th>
              <Th>Km Inicial</Th>
              <Th>Km Locada</Th>
              <Th>Cidade</Th>
              <Th>Locadora</Th>
              <Th>Observação</Th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><Td colSpan={7}>Carregando...</Td></tr>
            ) : veiculos.length === 0 ? (
              <tr><Td colSpan={7}>Nenhum veículo cadastrado.</Td></tr>
            ) : (
              veiculos.map(veic => (
                <tr key={veic.id}>
                  <Td>{veic.modelo}</Td>
                  <Td>{veic.placa || '-'}</Td>
                  <Td>{veic.km_inicial ?? '-'}</Td>
                  <Td>{veic.km_locada ?? '-'}</Td>
                  <Td>{veic.cidade || '-'}</Td>
                  <Td>{veic.locadora || '-'}</Td>
                  <Td>{veic.observacoes || '-'}</Td>
                </tr>
              ))
            )}
          </tbody>
        </StyledTable>
      </TableSection>
    </MainContainer>
  );
}
