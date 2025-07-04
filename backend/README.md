# Backend - Sistema de Controle de Veículos

## Configuração do Ambiente

1. **Crie um ambiente virtual** (recomendado):
   ```bash
   python -m venv venv
   source venv/Scripts/activate  # No Windows: venv\Scripts\activate
   ```

2. **Instale as dependências:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Crie a pasta de uploads:**
   ```bash
   mkdir uploads
   ```
##Corrigindo erro pip install pydantic[email]


## Executando o Servidor

## PARA EXECUTAR O COMANDO SEGUINTE PRECISA DAR ESSE PRIMEIRO .\venv\Scripts\activate

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

O servidor estará disponível em: http://localhost:8000

## Documentação da API

- **Swagger UI:** http://localhost:8000/docs
- **ReDoc:** http://localhost:8000/redoc

## Endpoints Principais

### Veículos
- `GET /api/veiculos/` - Lista todos os veículos disponíveis

### Reservas
- `POST /api/reservas/` - Cria uma nova reserva
- `GET /api/reservas/` - Lista todas as reservas (com filtros opcionais)
- `GET /api/reservas/minhas-reservas/{email}` - Lista reservas ativas de um usuário
- `POST /api/reservas/{reserva_id}/devolucao` - Registra a devolução de um veículo
- `DELETE /api/reservas/{reserva_id}` - Exclui uma reserva (requer senha)
