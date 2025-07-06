from sqlalchemy import create_engine, MetaData, Table, Column, String, text
from app.database import SQLALCHEMY_DATABASE_URL

# Conecta ao banco de dados
engine = create_engine(SQLALCHEMY_DATABASE_URL)
metadata = MetaData()

try:
    # Reflete a tabela existente
    metadata.reflect(bind=engine)
    
    # Verifica se a tabela reservas existe
    if 'reservas' not in metadata.tables:
        print("A tabela 'reservas' não existe no banco de dados.")
    else:
        reservas_table = Table('reservas', metadata, autoload_with=engine)
        
        # Verifica se a coluna já existe
        if 'responsavel_devolucao' not in reservas_table.columns:
            # Adiciona a nova coluna usando text() para o SQL bruto
            with engine.begin() as conn:
                conn.execute(text('ALTER TABLE reservas ADD COLUMN responsavel_devolucao VARCHAR(100)'))
            print("Coluna 'responsavel_devolucao' adicionada com sucesso!")
        else:
            print("A coluna 'responsavel_devolucao' já existe na tabela.")
            
except Exception as e:
    print(f"Ocorreu um erro: {str(e)}")