# Sistema de Controle de Veículos

Este sistema web permite gerenciar reservas e devoluções de veículos da empresa, com três telas principais:

- **Reserva de Veículo**
- **Devolução de Veículo**
- **Histórico de Reservas**

## Como executar

### 1. Backend
```sh
cd backend
npm install
npm start
```

### 2. Frontend
```sh
cd frontend
npm install
npm run dev
```

Acesse o frontend em [http://localhost:5173](http://localhost:5173).

---

- O backend roda por padrão em `http://localhost:3001`
- Imagens de painel são salvas em `backend/uploads` e acessíveis via link na tabela de histórico.
- Banco de dados SQLite local em `backend/db.sqlite`.

---

Sistema responsivo, otimizado para mobile e desktop, com interface moderna usando React e Material UI.
