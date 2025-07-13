# 🚗 Sistema de Controle de Veículos

Sistema web para gerenciamento de frota de veículos, com autenticação via Supabase e interface moderna construída em React e Material UI.

## ✨ Funcionalidades

- **Autenticação de usuários**
- **Reserva de veículos**
- **Devolução de veículos**
- **Histórico de reservas**
- **Gerenciamento de usuários (apenas administradores)**

## 🚀 Tecnologias

- **Frontend**: React 18 + Vite
- **UI**: Material UI (MUI) + Styled Components
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)
- **Gerenciamento de Estado**: Context API
- **Roteamento**: React Router DOM

## 🛠️ Como executar

### Pré-requisitos

- Node.js 16+
- Conta no [Supabase](https://supabase.com/)

### Configuração

1. Crie um novo projeto no Supabase
2. Configure as tabelas necessárias (usuários, veículos, reservas)
3. Crie um arquivo `.env` na pasta `frontend` com as seguintes variáveis:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

### Instalação e execução

```bash
# Acesse a pasta do frontend
cd frontend

# Instale as dependências
npm install

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse o sistema em [http://localhost:5173](http://localhost:5173)

## 🔒 Rotas Protegidas

O sistema possui autenticação e proteção de rotas. As rotas protegidas são:
- `/` (página inicial)
- `/devolucao`
- `/historico`
- `/veiculos`
- `/usuarios` (apenas admin)
- `/usuarios/novo` (apenas admin)
- `/usuarios/editar/:id` (apenas admin)

## 📱 Responsividade

O sistema é totalmente responsivo, funcionando bem tanto em dispositivos móveis quanto em desktops.

## 📄 Licença

Este projeto está sob a licença MIT.
