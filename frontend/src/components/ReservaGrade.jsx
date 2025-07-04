import React from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import dayjs from 'dayjs';

export default function ReservaGrade({ reservas }) {
  if (!reservas || reservas.length === 0) {
    return <Typography variant="body2">Nenhuma reserva futura encontrada.</Typography>;
  }
  return (
    <Box sx={{ mt: 1 }}>
      <Paper variant="outlined" sx={{ p: 2, bgcolor: '#f9fafc' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}><b>Retirada</b></Grid>
          <Grid item xs={12} sm={4}><b>Devolução Prevista</b></Grid>
          <Grid item xs={12} sm={4}><b>Responsável</b></Grid>
          {reservas.map(r => (
            <React.Fragment key={r.id}>
              <Grid item xs={12} sm={4}>{dayjs(r.dataRetirada).format('DD/MM/YYYY HH:mm')}</Grid>
              <Grid item xs={12} sm={4}>{dayjs(r.dataDevolucaoPrevista).format('DD/MM/YYYY HH:mm')}</Grid>
              <Grid item xs={12} sm={4}>{r.responsavel}</Grid>
            </React.Fragment>
          ))}
        </Grid>
      </Paper>
    </Box>
  );
}
