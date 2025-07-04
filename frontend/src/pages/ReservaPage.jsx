import React, { useState, useEffect } from 'react';
import ReservaForm from '../components/ReservaForm';
import ReservaGrade from '../components/ReservaGrade';
import axios from 'axios';

export default function ReservaPage() {
  const [reservas, setReservas] = useState([]);

  const fetchReservas = async () => {
    try {
      const response = await axios.get('/api/reservas/');
      const data = Array.isArray(response.data) ? response.data : [];
      setReservas(data);
    } catch (error) {
      setReservas([]);
    }
  };

  useEffect(() => {
    fetchReservas();
  }, []);

  const handleReservaCreated = () => {
    fetchReservas();
  };

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Reserva de Veículo</h2>
      <ReservaForm onReservaCreated={handleReservaCreated} />
      <ReservaGrade reservas={reservas} />
    </div>
  );
}
