# Backend - Sistema de Controle de Veículos

### Backend Local

Este projeto não possui mais backend local. Todas as operações de dados são realizadas diretamente através do Supabase.

### Configuração

- O sistema usa Supabase como banco de dados
- Não é necessário configurar ou executar nenhum servidor backend local
- Todas as operações de CRUD são feitas diretamente através do client do Supabase no frontend

### Documentação do Supabase

Para mais informações sobre a configuração do Supabase, consulte:
- [Documentação Oficial do Supabase](https://supabase.com/docs)
- [CLI do Supabase](https://supabase.com/docs/guides/cli)
- [SDK do Supabase para JavaScript](https://supabase.com/docs/reference/javascript/)

## Documentação da API

- **Swagger UI:** http://localhost:3001/docs
- **ReDoc:** http://localhost:3001/redoc

## Endpoints Principais

### Veículos
- `GET /api/veiculos/` - Lista todos os veículos disponíveis

### Reservas
- `POST /api/reservas/` - Cria uma nova reserva
- `GET /api/reservas/` - Lista todas as reservas (com filtros opcionais)
- `GET /api/reservas/minhas-reservas/{email}` - Lista reservas ativas de um usuário
- `POST /api/reservas/{reserva_id}/devolucao` - Registra a devolução de um veículo
- `DELETE /api/reservas/{reserva_id}` - Exclui uma reserva (requer senha)
