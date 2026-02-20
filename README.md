# Bar Controle - Sistema de Controle de Estoque

Sistema web moderno para controle de estoque em bares e estabelecimentos de bebidas.

## Visão Geral

Bar Controle é uma aplicação React desenvolvida para gerenciar:

- **Produtos**: Cadastro e controle de bebidas, estoque e preços
- **Movimentações**: Registro de entradas e saídas de estoque
- **Fornecedores**: Gerenciamento de fornecedores e prazos de entrega
- **Dashboard**: Visão geral de estoque e alertas de reposição

## Pré-requisitos

- Node.js 18+
- npm ou yarn
- Uma API REST rodando em `http://localhost:3000/api`

## Instalação

1. Clone o repositório

```bash
git clone <repo-url>
cd bar-controle-web
```

2. Instale as dependências

```bash
npm install
```

3. Configure as variáveis de ambiente

```bash
cp .env.example .env.local
```

Edite `.env.local`:

```
VITE_API_URL=http://localhost:3000/api
```

## Desenvolvimento

Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

A aplicação estará disponível em `http://localhost:5173`

## Build para Produção

```bash
npm run build
```

Para visualizar a build:

```bash
npm run preview
```

## Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Cria build de produção
- `npm run lint` - Verifica erros de linting
- `npm run lint:fix` - Corrige erros de linting automaticamente
- `npm run typecheck` - Verifica tipos TypeScript
- `npm run preview` - Visualiza build de produção

## Arquitetura

### Estrutura de Pastas

```
src/
├── services/                   # Serviços de API
│   ├── api.ts                  # Cliente HTTP com Axios
│   ├── auth.service.ts        # Autenticação
│   ├── produto.service.ts     # Gerenciamento de produtos
│   ├── movimentacao.service.ts # Movimentações de estoque
│   ├── fornecedor.service.ts  # Fornecedores
│   ├── estabelecimento.service.ts # Estabelecimentos
│   └── README.md              # Documentação dos serviços
├── lib/
│   ├── AuthContext.jsx        # Context de autenticação
│   ├── NavigationTracker.jsx  # Rastreamento de navegação
│   └── app-params.js          # Parâmetros da aplicação
├── pages/
│   ├── Dashboard.jsx          # Painel principal
│   ├── Produtos.jsx           # Gerenciamento de produtos
│   ├── Movimentacoes.jsx      # Histórico de movimentações
│   └── Fornecedores.jsx       # Gerenciamento de fornecedores
├── components/
│   ├── shared/                # Componentes compartilhados
│   ├── produtos/              # Componentes de produtos
│   └── ui/                    # Componentes de UI (Radix)
└── utils/
    └── index.ts               # Utilitários gerais
```

### Fluxo de Dados

1. **Autenticação**: Login → Token armazenado no localStorage
2. **API Calls**: Serviços importados → apiClient.get/post/put/delete
3. **Estado**: React Hooks (useState, useEffect)
4. **UI**: Componentes React com Tailwind CSS + Radix UI

## Serviços Disponíveis

Consulte [src/services/README.md](src/services/README.md) para documentação completa dos serviços.

## Especificação da API

Consulte [API_SPECIFICATION.md](API_SPECIFICATION.md) para detalhes dos endpoints REST que o backend deve implementar.

## Autenticação

O sistema usa JWT (JSON Web Tokens) para autenticação:

1. **Login**: POST `/auth/login` com email e senha
2. **Token**: Armazenado em `localStorage` com chave `auth_token`
3. **Requisições**: Token incluído automaticamente em `Authorization: Bearer {token}`
4. **Refresh**: Se receber 401, o cliente faz logout e redireciona para login

## Principais Dependências

- **React 18**: Framework UI
- **React Router**: Roteamento
- **Axios**: HTTP Client
- **React Query**: Gerenciamento de estado de servidor
- **Tailwind CSS**: Estilização
- **Radix UI**: Componentes acessíveis
- **date-fns**: Manipulação de datas
- **Lucide React**: Ícones
- **Zod**: Validação de esquemas

## Removidos do Projeto

Esta refatoração remove as dependências do Base44 SDK:

✅ Removidos:

- `@base44/sdk`
- `@base44/vite-plugin`

✅ Migrados para API REST:

- Autenticação
- CRUD de dados
- Gerenciamento de entidades

## Próximas Etapas

Para completar a migração:

1. **Backend**: Implementar API REST seguindo a [especificação](API_SPECIFICATION.md)
2. **Instalação**: `npm install` para instalar axios
3. **Testes**: Adicionar testes unitários e de integração
4. **CI/CD**: Configurar pipeline de build e deploy
5. **Segurança**: Implementar CORS, rate limiting, validações

## Suporte

Para dúvidas sobre a arquitetura:

- Consulte a documentação dos serviços em `src/services/README.md`
- Veja exemplos de uso em componentes como `src/pages/Produtos.jsx`
- Verifique a especificação da API em `API_SPECIFICATION.md`

## License

[Defina a licença]

**Publish your changes**

Open [Base44.com](http://Base44.com) and click on Publish.

**Docs & Support**

Documentation: [https://docs.base44.com/Integrations/Using-GitHub](https://docs.base44.com/Integrations/Using-GitHub)

Support: [https://app.base44.com/support](https://app.base44.com/support)
