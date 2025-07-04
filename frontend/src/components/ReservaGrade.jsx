import React from 'react';

export default function ReservaGrade({ reservas = [] }) {
  return (
    <div className="mt-4">
      <h5 className="mb-3">Reservas Futuras</h5>
      <div className="table-responsive">
        <table className="table table-striped table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Veículo</th>
              <th>Data de Retirada</th>
              <th>Data de Devolução Prevista</th>
              <th>Responsável</th>
              <th>Departamento</th>
            </tr>
          </thead>
          <tbody>
            {reservas && reservas.length > 0 ? (
              reservas.map((reserva) => (
                <tr key={reserva.id}>
                  <td>{reserva.veiculo}</td>
                  <td>{new Date(reserva.data_retirada).toLocaleString('pt-BR')}</td>
                  <td>{new Date(reserva.data_devolucao_prevista).toLocaleString('pt-BR')}</td>
                  <td>{reserva.responsavel}</td>
                  <td>{reserva.departamento}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="text-center text-muted">Nenhuma reserva encontrada.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
