# Especificação da API REST - Bar Controle Web

## Visão Geral

Este documento descreve os endpoints da API REST que o backend deve implementar para suportar a aplicação de controle de estoque de bar.

**Base URL**: `http://localhost:3000/api`

## Autenticação

### Headers Obrigatórios

```
Authorization: Bearer {token}
Content-Type: application/json
```

O token JWT deve ser incluído no header `Authorization` como `Bearer {token}` em todas as requisições, exceto nas rotas de autenticação.

## Endpoints de Autenticação

### POST `/auth/login`

Fazer login com email e senha.

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "senha123"
}
```

**Response** (200 OK):

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "123",
    "name": "João Silva",
    "email": "user@example.com",
    "role": "user",
    "estabelecimento_id": "est-123",
    "estabelecimento_nome": "Bar do João"
  }
}
```

### GET `/auth/me`

Obter dados do usuário autenticado.

**Response** (200 OK):

```json
{
  "id": "123",
  "name": "João Silva",
  "email": "user@example.com",
  "role": "user",
  "estabelecimento_id": "est-123",
  "estabelecimento_nome": "Bar do João"
}
```

### PUT `/auth/me`

Atualizar dados do usuário autenticado.

**Request Body** (campos opcionais):

```json
{
  "name": "Novo Nome",
  "email": "novo@example.com",
  "estabelecimento_id": "est-456",
  "estabelecimento_nome": "Bar do João - Nova Sede"
}
```

**Response** (200 OK):

```json
{
  "id": "123",
  "name": "Novo Nome",
  "email": "novo@example.com",
  "role": "user",
  "estabelecimento_id": "est-456",
  "estabelecimento_nome": "Bar do João - Nova Sede"
}
```

## Endpoints de Estabelecimentos

### GET `/estabelecimentos`

Listar todos os estabelecimentos do usuário.

**Response** (200 OK):

```json
[
  {
    "id": "est-123",
    "nome": "Bar do João",
    "created_at": "2025-02-19T10:30:00Z",
    "updated_at": "2025-02-19T10:30:00Z"
  }
]
```

### GET `/estabelecimentos/{id}`

Obter estabelecimento por ID.

**Response** (200 OK):

```json
{
  "id": "est-123",
  "nome": "Bar do João",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### POST `/estabelecimentos`

Criar novo estabelecimento.

**Request Body**:

```json
{
  "nome": "Bar do João"
}
```

**Response** (201 Created):

```json
{
  "id": "est-123",
  "nome": "Bar do João",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### PUT `/estabelecimentos/{id}`

Atualizar estabelecimento.

**Request Body**:

```json
{
  "nome": "Bar do João - Atualizado"
}
```

**Response** (200 OK):

```json
{
  "id": "est-123",
  "nome": "Bar do João - Atualizado",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### DELETE `/estabelecimentos/{id}`

Deletar estabelecimento.

**Response** (204 No Content)

## Endpoints de Produtos

### GET `/produtos`

Listar produtos com filtros opcionais.

**Query Parameters**:

- `estabelecimento_id` (string) - ID do estabelecimento
- `categoria` (string) - Filtrar por categoria
- `sort` (string) - Ordenação (ex: "-created_at")
- `limit` (number) - Limite de resultados

**Response** (200 OK):

```json
[
  {
    "id": "prod-123",
    "nome": "Skol 600ml",
    "categoria": "Cerveja",
    "volume": "600ml",
    "estoque_atual": 50,
    "estoque_minimo": 10,
    "preco_compra": 2.5,
    "preco_venda": 5.99,
    "fornecedor_id": "forn-123",
    "estabelecimento_id": "est-123",
    "status": "OK",
    "created_at": "2025-02-19T10:30:00Z",
    "updated_at": "2025-02-19T10:30:00Z"
  }
]
```

### GET `/produtos/{id}`

Obter produto por ID.

**Response** (200 OK):

```json
{
  "id": "prod-123",
  "nome": "Skol 600ml",
  "categoria": "Cerveja",
  "volume": "600ml",
  "estoque_atual": 50,
  "estoque_minimo": 10,
  "preco_compra": 2.5,
  "preco_venda": 5.99,
  "fornecedor_id": "forn-123",
  "estabelecimento_id": "est-123",
  "status": "OK",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### POST `/produtos`

Criar novo produto.

**Request Body**:

```json
{
  "nome": "Skol 600ml",
  "categoria": "Cerveja",
  "volume": "600ml",
  "estoque_atual": 50,
  "estoque_minimo": 10,
  "preco_compra": 2.5,
  "preco_venda": 5.99,
  "fornecedor_id": "forn-123",
  "estabelecimento_id": "est-123",
  "status": "OK"
}
```

**Response** (201 Created):

```json
{
  "id": "prod-123",
  "nome": "Skol 600ml",
  "categoria": "Cerveja",
  "volume": "600ml",
  "estoque_atual": 50,
  "estoque_minimo": 10,
  "preco_compra": 2.5,
  "preco_venda": 5.99,
  "fornecedor_id": "forn-123",
  "estabelecimento_id": "est-123",
  "status": "OK",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### PUT `/produtos/{id}`

Atualizar produto.

**Request Body** (campos opcionais):

```json
{
  "nome": "Skol 600ml Premium",
  "estoque_atual": 45,
  "preco_venda": 6.49
}
```

**Response** (200 OK):

```json
{
  "id": "prod-123",
  "nome": "Skol 600ml Premium",
  "categoria": "Cerveja",
  "volume": "600ml",
  "estoque_atual": 45,
  "estoque_minimo": 10,
  "preco_compra": 2.5,
  "preco_venda": 6.49,
  "fornecedor_id": "forn-123",
  "estabelecimento_id": "est-123",
  "status": "OK",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### DELETE `/produtos/{id}`

Deletar produto.

**Response** (204 No Content)

## Endpoints de Movimentações de Estoque

### GET `/movimentacoes`

Listar movimentações com filtros opcionais.

**Query Parameters**:

- `estabelecimento_id` (string) - ID do estabelecimento
- `produto_id` (string) - ID do produto
- `tipo` (string) - "Entrada" ou "Saída"
- `sort` (string) - Ordenação (ex: "-created_at")
- `limit` (number) - Limite de resultados

**Response** (200 OK):

```json
[
  {
    "id": "mov-123",
    "produto_id": "prod-123",
    "produto_nome": "Skol 600ml",
    "tipo": "Entrada",
    "quantidade": 24,
    "data": "2025-02-19",
    "observacao": "Compra do fornecedor X",
    "estabelecimento_id": "est-123",
    "created_at": "2025-02-19T10:30:00Z",
    "updated_at": "2025-02-19T10:30:00Z"
  }
]
```

### GET `/movimentacoes/{id}`

Obter movimentação por ID.

**Response** (200 OK):

```json
{
  "id": "mov-123",
  "produto_id": "prod-123",
  "produto_nome": "Skol 600ml",
  "tipo": "Entrada",
  "quantidade": 24,
  "data": "2025-02-19",
  "observacao": "Compra do fornecedor X",
  "estabelecimento_id": "est-123",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### POST `/movimentacoes`

Criar nova movimentação.

**Request Body**:

```json
{
  "produto_id": "prod-123",
  "produto_nome": "Skol 600ml",
  "tipo": "Entrada",
  "quantidade": 24,
  "data": "2025-02-19",
  "observacao": "Compra do fornecedor X",
  "estabelecimento_id": "est-123"
}
```

**Response** (201 Created):

```json
{
  "id": "mov-123",
  "produto_id": "prod-123",
  "produto_nome": "Skol 600ml",
  "tipo": "Entrada",
  "quantidade": 24,
  "data": "2025-02-19",
  "observacao": "Compra do fornecedor X",
  "estabelecimento_id": "est-123",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### PUT `/movimentacoes/{id}`

Atualizar movimentação.

**Request Body** (campos opcionais):

```json
{
  "quantidade": 25,
  "observacao": "Corrigido"
}
```

**Response** (200 OK):

```json
{
  "id": "mov-123",
  "produto_id": "prod-123",
  "produto_nome": "Skol 600ml",
  "tipo": "Entrada",
  "quantidade": 25,
  "data": "2025-02-19",
  "observacao": "Corrigido",
  "estabelecimento_id": "est-123",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### DELETE `/movimentacoes/{id}`

Deletar movimentação.

**Response** (204 No Content)

## Endpoints de Fornecedores

### GET `/fornecedores`

Listar fornecedores com filtros opcionais.

**Query Parameters**:

- `estabelecimento_id` (string) - ID do estabelecimento

**Response** (200 OK):

```json
[
  {
    "id": "forn-123",
    "nome": "Distribuidora ABC",
    "telefone": "(11) 99999-9999",
    "prazo_entrega_dias": 3,
    "estabelecimento_id": "est-123",
    "created_at": "2025-02-19T10:30:00Z",
    "updated_at": "2025-02-19T10:30:00Z"
  }
]
```

### GET `/fornecedores/{id}`

Obter fornecedor por ID.

**Response** (200 OK):

```json
{
  "id": "forn-123",
  "nome": "Distribuidora ABC",
  "telefone": "(11) 99999-9999",
  "prazo_entrega_dias": 3,
  "estabelecimento_id": "est-123",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### POST `/fornecedores`

Criar novo fornecedor.

**Request Body**:

```json
{
  "nome": "Distribuidora ABC",
  "telefone": "(11) 99999-9999",
  "prazo_entrega_dias": 3,
  "estabelecimento_id": "est-123"
}
```

**Response** (201 Created):

```json
{
  "id": "forn-123",
  "nome": "Distribuidora ABC",
  "telefone": "(11) 99999-9999",
  "prazo_entrega_dias": 3,
  "estabelecimento_id": "est-123",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### PUT `/fornecedores/{id}`

Atualizar fornecedor.

**Request Body** (campos opcionais):

```json
{
  "nome": "Distribuidora ABC Ltda",
  "telefone": "(11) 98888-8888"
}
```

**Response** (200 OK):

```json
{
  "id": "forn-123",
  "nome": "Distribuidora ABC Ltda",
  "telefone": "(11) 98888-8888",
  "prazo_entrega_dias": 3,
  "estabelecimento_id": "est-123",
  "created_at": "2025-02-19T10:30:00Z",
  "updated_at": "2025-02-19T10:30:00Z"
}
```

### DELETE `/fornecedores/{id}`

Deletar fornecedor.

**Response** (204 No Content)

## Códigos de Resposta HTTP

- **200 OK**: Requisição bem-sucedida
- **201 Created**: Recurso criado com sucesso
- **204 No Content**: Operação bem-sucedida, sem conteúdo na resposta
- **400 Bad Request**: Requisição inválida
- **401 Unauthorized**: Não autenticado ou token inválido
- **403 Forbidden**: Não autorizado para acessar o recurso
- **404 Not Found**: Recurso não encontrado
- **500 Internal Server Error**: Erro interno do servidor

## Tratamento de Erros

Respostas de erro devem incluir:

```json
{
  "error": true,
  "message": "Descrição do erro",
  "details": {}
}
```

## Variáveis de Ambiente

Configure a seguinte variável no arquivo `.env` do frontend:

```
REACT_APP_API_URL=http://localhost:3000/api
```

## Segurança

1. O token JWT deve ser armazenado no `localStorage` com a chave `auth_token`
2. O token deve ser enviado no header `Authorization: Bearer {token}` em todas as requisições autenticadas
3. Se o servidor retornar 401, o cliente deve limpar o token e redirecionar para login
4. Implementar CORS no backend para permitir requisições do frontend

## Próximos Passos

1. Implementar endpoints de autenticação com JWT
2. Criar modelos de dados no banco de dados
3. Implementar validação de permissões (usuário só vê dados do seu estabelecimento)
4. Adicionar rates limiting e logging
5. Configurar certificados SSL/TLS para produção
