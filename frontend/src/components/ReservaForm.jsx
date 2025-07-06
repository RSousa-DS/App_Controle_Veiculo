import React, { useState } from 'react';
import axios from 'axios';

export default function ReservaForm({ onReservaCreated }) {
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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    try {
      // Converter datas para ISO antes de enviar para o backend
      const dataRetirada = new Date(formData.dataRetirada).toISOString();
      const dataDevolucaoPrevista = new Date(formData.dataDevolucaoPrevista).toISOString();
      const response = await axios.post('/api/reservas/', {
        ...formData,
        dataRetirada,
        dataDevolucaoPrevista
      }); 
      setSuccess(true);
      setFormData({
        veiculo: '',
        dataRetirada: '',
        dataDevolucaoPrevista: '',
        responsavel: '',
        email: '',
        departamento: ''
      });
      if (onReservaCreated) onReservaCreated(response.data);
    } catch (err) {
      setError('Erro ao criar reserva. Horário Indisponível!');
    }
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
            <option value="T-Cross">T-Cross</option>
            <option value="Polo VW">Polo VW</option>
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
      <button type="submit" className="btn btn-primary mt-3">
        Criar Reserva
      </button>
    </form>
  );
}
