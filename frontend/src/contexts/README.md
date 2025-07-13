# 🧩 Contextos

Esta pasta contém os contextos React utilizados para gerenciamento de estado global na aplicação. Os contextos permitem compartilhar dados entre componentes sem precisar passar props manualmente em cada nível da árvore de componentes.

## Contextos Atuais

### `AuthContext.jsx`
Gerencia o estado de autenticação do usuário, incluindo:
- Estado do usuário logado
- Funções de login/logout
- Verificação de permissões
- Token de autenticação

## Como Usar um Contexto

1. Importe o contexto desejado:
   ```jsx
   import { useAuth } from '../contexts/AuthContext';
   ```

2. Use o hook do contexto em um componente funcional:
   ```jsx
   function MeuComponente() {
     const { user, isAdmin } = useAuth();
     // ...
   }
   ```

## Boas Práticas

1. **Separação de Responsabilidades**: Mantenha cada contexto focado em um único aspecto da aplicação
2. **Performance**: Use `useMemo` e `useCallback` para otimizar o desempenho
3. **Tipagem**: Documente a estrutura do contexto e suas funções
4. **Testes**: Escreva testes para os provedores de contexto

## Adicionando um Novo Contexto

1. Crie um novo arquivo com o nome do contexto (ex: `NomeContext.jsx`)
2. Defina o contexto usando `createContext`
3. Crie um provedor personalizado
4. Exporte o contexto e um hook personalizado para usá-lo
