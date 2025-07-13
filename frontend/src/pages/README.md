# 📄 Páginas

Esta pasta contém os componentes de página da aplicação. Cada arquivo aqui representa uma rota distinta na aplicação.

## Estrutura

```
pages/
├── DevolucaoPage.jsx      # Página de devolução de veículos
├── HistoricoPage.jsx      # Página de histórico de reservas
├── LoginPage.jsx          # Página de login
├── ReservaPage.jsx        # Página de reserva de veículos
├── VeiculosPage.jsx       # Página de gerenciamento de veículos
└── usuarios/              # Páginas de gerenciamento de usuários
    ├── ListaUsuarios.jsx  # Lista de usuários (apenas admin)
    └── FormularioUsuario.jsx # Formulário de usuário
```

## Características das Páginas

- Cada página é responsável por sua própria lógica e estado
- Podem conter múltiplos componentes reutilizáveis
- Devem ser protegidas conforme necessário (usando `PrivateRoute`)
- Devem ser responsivas e funcionar bem em diferentes tamanhos de tela

## Boas Práticas

1. **Organização**: Mantenha a lógica de negócios separada dos componentes de UI
2. **Performance**: Use lazy loading para carregar páginas sob demanda
3. **Tratamento de Erros**: Implemente tratamento de erros adequado
4. **Loading States**: Adicione estados de carregamento para melhor UX
5. **Documentação**: Documente props e comportamento esperado

## Adicionando uma Nova Página

1. Crie um novo arquivo com o sufixo `Page` (ex: `NovaPaginaPage.jsx`)
2. Defina a rota em `App.jsx`
3. Adicione a rota ao menu de navegação, se aplicável
4. Adicione testes para garantir o funcionamento correto
