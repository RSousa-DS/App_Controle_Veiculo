-- Adiciona a coluna 'ativo' à tabela 'veiculos' se ela não existir
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'veiculos' AND column_name = 'ativo') THEN
        ALTER TABLE veiculos ADD COLUMN ativo BOOLEAN DEFAULT TRUE;
        COMMENT ON COLUMN veiculos.ativo IS 'Indica se o veículo está ativo para reservas';
    END IF;
END $$;
