import React, { useState, useEffect } from 'react';
import { Box, TextField, Button, MenuItem, Grid, Typography, Alert } from '@mui/material';
import dayjs from 'dayjs';
import axios from 'axios';
import ReservaGrade from './ReservaGrade';

export default function ReservaForm() {
  const [veiculos, setVeiculos] = useState([]);
  const [form, setForm] = useState({
    responsavel: '',
    email: '',
    departamento: '',
    veiculo: '',
    dataRetirada: '',
    dataDevolucaoPrevista: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [grade, setGrade] = useState([]);

  useEffect(() => {
    axios.get('/api/veiculos').then(res => setVeiculos(res.data));
  }, []);

  useEffect(() => {
    setGrade([]);
    if (form.veiculo) {
      axios.get('/api/calendario', { params: { veiculo: form.veiculo } })
        .then(res => setGrade(res.data))
        .catch(() => setGrade([]));
    }
  }, [form.veiculo]);

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function validate() {
    if (!form.responsavel || !form.email || !form.departamento || !form.veiculo || !form.dataRetirada || !form.dataDevolucaoPrevista)
      return 'Preencha todos os campos obrigatórios.';
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      return 'Email inválido.';
    if (dayjs(form.dataRetirada).isAfter(dayjs(form.dataDevolucaoPrevista)))
      return 'Data/hora de retirada deve ser anterior à devolução prevista.';
    return '';
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');
    const val = validate();
    if (val) return setError(val);
    setLoading(true);
    try {
      await axios.post('/api/reservas', form);
      setSuccess('Reserva realizada com sucesso!');
      setForm({ ...form, dataRetirada: '', dataDevolucaoPrevista: '' });
      setGrade([]);
    } catch (err) {
      setError(err.response?.data?.error || 'Erro ao reservar.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={6}>
          <TextField name="responsavel" label="Responsável" fullWidth required value={form.responsavel} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="email" label="Email" fullWidth required value={form.email} onChange={handleChange} type="email" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="departamento" label="Departamento" fullWidth required value={form.departamento} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="veiculo" label="Veículo" select fullWidth required value={form.veiculo} onChange={handleChange}>
            {veiculos.map(v => <MenuItem key={v} value={v}>{v}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="dataRetirada" label="Data/Hora de Retirada" type="datetime-local" fullWidth required InputLabelProps={{ shrink: true }} value={form.dataRetirada} onChange={handleChange} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField name="dataDevolucaoPrevista" label="Data/Hora Devolução Prevista" type="datetime-local" fullWidth required InputLabelProps={{ shrink: true }} value={form.dataDevolucaoPrevista} onChange={handleChange} />
        </Grid>
      </Grid>
      <Box sx={{ mt: 3 }}>
        <Typography variant="subtitle1" gutterBottom>
          Reservas futuras para o veículo selecionado:
        </Typography>
        <ReservaGrade reservas={grade} />
      </Box>
      {error && <Alert severity="error" sx={{ mt: 2 }}>{error}</Alert>}
      {success && <Alert severity="success" sx={{ mt: 2 }}>{success}</Alert>}
      <Button type="submit" variant="contained" color="primary" sx={{ mt: 3 }} disabled={loading}>
        Reservar
      </Button>
    </Box>
  );
}
