# 🔌 Serviços

Esta pasta contém os serviços responsáveis pela comunicação com APIs externas e lógica de negócios da aplicação.

## Estrutura

```
services/
├── api.js            # Configuração base do cliente HTTP (Axios)
└── supabase.js       # Configuração e funções do Supabase
```

## Serviços Principais

### `api.js`
- Configuração base do cliente HTTP usando Axios
- Interceptores para tratamento global de erros
- Configuração de headers comuns

### `supabase.js`
- Configuração do cliente Supabase
- Funções auxiliares para autenticação e operações de banco de dados
- Tipos e interfaces comuns

## Boas Práticas

1. **Separação de Responsabilidades**: Mantenha cada serviço focado em um domínio específico
2. **Tratamento de Erros**: Implemente tratamento de erros consistente
3. **Documentação**: Documente as funções e parâmetros
4. **Tipagem**: Use TypeScript ou PropTypes para documentar os tipos
5. **Testes**: Escreva testes para os serviços

## Como Adicionar um Novo Serviço

1. Crie um novo arquivo com o nome do domínio (ex: `veiculoService.js`)
2. Exporte funções específicas para operações relacionadas
3. Documente o serviço e suas funções
4. Adicione testes unitários
