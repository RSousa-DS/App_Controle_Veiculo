#!/bin/bash

# Cria e ativa o ambiente virtual
python -m venv venv
source venv/Scripts/activate

# Instala as dependências
pip install -r requirements.txt

# Cria a pasta de uploads
mkdir -p uploads

# Inicia o servidor
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
