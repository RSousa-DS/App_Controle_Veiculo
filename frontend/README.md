# Frontend - Sistema de Controle de Veículos

Aplicativo web para gerenciamento de frota de veículos, construído com React e integrado ao Supabase para autenticação e banco de dados.

## 🏗️ Estrutura do Projeto

```
src/
├── assets/          # Recursos estáticos (imagens, ícones, etc.)
├── components/      # Componentes reutilizáveis
├── contexts/        # Contextos React para gerenciamento de estado global
├── lib/             # Bibliotecas e configurações de terceiros
├── pages/           # Componentes de páginas
│   └── usuarios/    # Páginas específicas de gerenciamento de usuários
└── services/        # Serviços e integrações com APIs
```

## 🚀 Como executar

1. Instale as dependências:
   ```bash
   npm install
   ```

2. Configure as variáveis de ambiente:
   Crie um arquivo `.env` na raiz do frontend com:
   ```
   VITE_SUPABASE_URL=sua_url_do_supabase
   VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase
   ```

3. Inicie o servidor de desenvolvimento:
   ```bash
   npm run dev
   ```

## 🛠 Tecnologias Principais

- **Framework**: React 18
- **Build**: Vite
- **UI**: Material UI (MUI) + Styled Components
- **Gerenciamento de Estado**: Context API
- **Roteamento**: React Router DOM
- **Autenticação**: Supabase Auth
- **Banco de Dados**: Supabase (PostgreSQL)

## 📦 Scripts Disponíveis

- `npm run dev` - Inicia o servidor de desenvolvimento
- `npm run build` - Gera a versão de produção
- `npm run lint` - Executa o linter
- `npm run preview` - Visualiza a build de produção localmente

## 🧪 Testes

Para executar os testes:
```bash
npm test
```

## 📄 Licença

Este projeto está sob a licença MIT.
