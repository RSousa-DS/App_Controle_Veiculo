import React, { useState, useEffect } from 'react';
import ReservaForm from '../components/ReservaForm';
import ReservaGrade from '../components/ReservaGrade';
import { supabase } from '../supabaseClient';

export default function ReservaPage() {
  const [reservas, setReservas] = useState([]);

  const fetchReservas = async () => {
    try {
      const { data, error } = await supabase
        .from('reservas')
        
        .order('data_retirada', { ascending: false });
      setReservas(error ? [] : (data || []));
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
