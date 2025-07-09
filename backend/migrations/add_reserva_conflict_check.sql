-- Criação de uma função para verificar conflitos de reserva
CREATE OR REPLACE FUNCTION verificar_conflito_reserva()
RETURNS TRIGGER AS $$
BEGIN
  -- Verifica se existe alguma reserva ativa para o mesmo veículo no período desejado
  IF EXISTS (
    SELECT 1 
    FROM reservas r
    WHERE r.veiculo_id = NEW.veiculo_id
      AND r.status_devolucao = 'Pendente'
      AND r.id != COALESCE(NEW.id, -1)  -- Permite atualização da mesma reserva
      AND (
        (NEW.data_retirada BETWEEN r.data_retirada AND r.data_devolucao_prevista) OR
        (NEW.data_devolucao_prevista BETWEEN r.data_retirada AND r.data_devolucao_prevista) OR
        (NEW.data_retirada <= r.data_retirada AND NEW.data_devolucao_prevista >= r.data_devolucao_prevista)
      )
  ) THEN
    RAISE EXCEPTION 'Conflito de reserva: Já existe uma reserva ativa para este veículo no período selecionado.';
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criação do trigger para verificar conflitos antes de inserir ou atualizar uma reserva
DROP TRIGGER IF EXISTS trg_verificar_conflito_reserva ON reservas;

CREATE TRIGGER trg_verificar_conflito_reserva
BEFORE INSERT OR UPDATE ON reservas
FOR EACH ROW
WHEN (NEW.status_devolucao = 'Pendente')
EXECUTE FUNCTION verificar_conflito_reserva();

-- Criação de um índice para melhorar o desempenho da verificação de conflitos
CREATE INDEX IF NOT EXISTS idx_reservas_veiculo_periodo ON reservas 
(veiculo_id, data_retirada, data_devolucao_prevista) 
WHERE status_devolucao = 'Pendente';
