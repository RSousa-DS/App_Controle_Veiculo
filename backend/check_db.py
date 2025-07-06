from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker

# Conecta ao banco de dados SQLite
engine = create_engine('sqlite:///sistema_veiculos.db')

# Cria um inspetor para examinar o banco de dados
inspector = inspect(engine)

# Obtém a lista de tabelas
tables = inspector.get_table_names()
print("Tabelas no banco de dados:")
for table in tables:
    print(f"\nTabela: {table}")
    print("Colunas:")
    for column in inspector.get_columns(table):
        print(f"  - {column['name']} ({column['type']})")

# Verifica se a tabela alembic_version existe
if 'alembic_version' in tables:
    print("\nVersão do Alembic:")
    with engine.connect() as conn:
        result = conn.execute("SELECT * FROM alembic_version")
        for row in result:
            print(f"Versão: {row[0]}")
else:
    print("\nTabela alembic_version não encontrada.")
