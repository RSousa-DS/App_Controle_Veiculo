# 📦 Componentes

Esta pasta contém componentes reutilizáveis que são utilizados em várias partes da aplicação. Cada componente deve ser independente e seguir o princípio de responsabilidade única.

## Estrutura Recomendada

```
components/
├── NomeDoComponente/
│   ├── index.jsx          # Componente principal
│   ├── styles.js          # Estilos específicos do componente
│   ├── __tests__/         # Testes do componente
│   └── README.md          # Documentação do componente (opcional)
```

## Componentes Atuais

- `Navbar.jsx` - Barra de navegação principal da aplicação
- `PrivateRoute.jsx` - Componente para proteger rotas que requerem autenticação
- `ReservaForm.jsx` - Formulário para criação/edição de reservas
- `ReservaGrade.jsx` - Tabela que exibe a lista de reservas

## Boas Práticas

1. **Nomenclatura**: Use PascalCase para nomes de componentes (ex: `MeuComponente.jsx`)
2. **Props**: Documente as props usando PropTypes ou TypeScript
3. **Estilização**: Use Styled Components para estilização
4. **Testes**: Adicione testes para garantir a estabilidade
5. **Documentação**: Adicione um README para componentes complexos

## Como Adicionar um Novo Componente

1. Crie uma nova pasta com o nome do componente
2. Adicione o arquivo principal do componente
3. Adicione estilos específicos se necessário
4. Adicione testes
5. Documente o componente
