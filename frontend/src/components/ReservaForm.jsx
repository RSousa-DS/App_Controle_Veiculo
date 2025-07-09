import React, { useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';

export default function ReservaForm({ onReservaCreated }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    veiculo: '',
    dataRetirada: '',
    dataDevolucaoPrevista: '',
    responsavel: '',
    email: '',
    departamento: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [veiculos, setVeiculos] = useState([]);

  useEffect(() => {
    // Buscar veículos do Supabase
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setIsSubmitting(true);
    
    // Verificação de permissão simplificada
    // Se for uma edição, a permissão é verificada no componente que chama o formulário
    
    console.log('Iniciando submissão do formulário...');
    console.log('Dados do formulário:', formData);
    
    try {
      // Validação simples
      if (!formData.veiculo || !formData.dataRetirada || !formData.dataDevolucaoPrevista || !formData.responsavel || !formData.email || !formData.departamento) {
        setError('Preencha todos os campos obrigatórios.');
        setIsSubmitting(false);
        return;
      }
      // Converter datas para ISO
      const data_retirada = new Date(formData.dataRetirada).toISOString();
      const data_devolucao_prevista = new Date(formData.dataDevolucaoPrevista).toISOString();
      if (!user) {
        setError('Usuário não autenticado. Faça login novamente.');
        setIsSubmitting(false);
        return;
      }

      // Usar o ID do usuário do contexto de autenticação
      console.log('Usuário do contexto:', user);
      
      if (!user || !user.id) {
        console.error('Usuário não autenticado ou ID inválido');
        setError('Usuário não autenticado. Faça login novamente.');
        setIsSubmitting(false);
        return;
      }
      
      const reservaData = {
        veiculo: formData.veiculo,
        veiculo_id: parseInt(formData.veiculo),  // Adicionado veiculo_id convertendo para número
        responsavel: formData.responsavel,
        email: formData.email,
        departamento: formData.departamento,
        data_retirada,
        data_devolucao_prevista,
        status_devolucao: 'Pendente',
        usuario_id: user.id
      };
      
      console.log('Dados da reserva a serem enviados:', reservaData);
      
      console.log('Tentando inserir reserva:', reservaData);
      
      const { data, error: insertError } = await supabase
        .from('reservas')
        .insert([reservaData])
        .select();
        
      console.log('Resposta da inserção:', { data, error: insertError });
      if (insertError) {
        console.error('Erro detalhado ao criar reserva:', insertError);
        const errorMessage = insertError.message || 'Erro ao criar reserva. Verifique os dados e tente novamente.';
        setError(errorMessage);
      } else {
        console.log('Reserva criada com sucesso!', data);
        setSuccess(true);
        setFormData({
          veiculo: '',
          dataRetirada: '',
          dataDevolucaoPrevista: '',
          responsavel: '',
          email: '',
          departamento: ''
        });
        if (onReservaCreated) onReservaCreated();
      }
    } catch (err) {
      setError('Erro ao criar reserva.');
    }
    setIsSubmitting(false);
  };

  return (
    <form className="p-4 border rounded bg-white shadow-sm mb-4" onSubmit={handleSubmit}>
      <div className="row g-3">
        <div className="col-md-6">
          <label className="form-label">Veículo *</label>
          <select
            className="form-select"
            name="veiculo"
            required
            value={formData.veiculo}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {veiculos.map(v => (
              <option key={v.id} value={v.id}>
                {v.modelo} {v.placa ? `(${v.placa})` : ''}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-6">
          <label className="form-label">Responsável *</label>
          <input
            type="text"
            className="form-control"
            name="responsavel"
            required
            value={formData.responsavel}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Email *</label>
          <input
            type="email"
            className="form-control"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Departamento *</label>
          <input
            type="text"
            className="form-control"
            name="departamento"
            required
            value={formData.departamento}
            onChange={handleChange}
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Data/Hora Retirada *</label>
          <input
            type="datetime-local"
            className="form-control"
            name="dataRetirada"
            required
            value={formData.dataRetirada}
            onChange={handleChange}
            pattern="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}"
          />
        </div>
        <div className="col-md-6">
          <label className="form-label">Data/Hora Devolução *</label>
          <input
            type="datetime-local"
            className="form-control"
            name="dataDevolucaoPrevista"
            required
            value={formData.dataDevolucaoPrevista}
            onChange={handleChange}
            pattern="\\d{4}-\\d{2}-\\d{2}T\\d{2}:\\d{2}"
          />
        </div>
      </div>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {success && <div className="alert alert-success mt-3">Reserva criada com sucesso!</div>}
      <button type="submit" className="btn btn-primary mt-3" disabled={isSubmitting}>
        {isSubmitting ? 'Salvando...' : 'Criar Reserva'}
      </button>
    </form>
  );
}
