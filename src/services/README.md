# Serviços da Aplicação

Este diretório contém todos os serviços da aplicação que fazem requisições à API REST.

## Estrutura

### `api.ts`

Cliente HTTP centralizado usando Axios com:

- Configuração automática de token JWT no header `Authorization`
- Interceptadores para tratamento de erros
- Métodos genéricos `get()`, `post()`, `put()`, `delete()`
- Gerenciamento de tokens através do `localStorage`

**Uso**:

```typescript
import apiClient from "@/services/api";

// GET
const data = await apiClient.get("/endpoint");

// POST
const response = await apiClient.post("/endpoint", { data });

// PUT
const updated = await apiClient.put("/endpoint/1", { data });

// DELETE
await apiClient.delete("/endpoint/1");

// Gerenciar token
apiClient.setToken(token);
apiClient.getToken();
apiClient.clearToken();
```

### `auth.service.ts`

Serviço de autenticação com métodos para:

- `login(email, password)` - Fazer login
- `getCurrentUser()` - Obter usuário autenticado
- `updateUser(data)` - Atualizar perfil do usuário
- `logout()` - Fazer logout
- `isAuthenticated()` - Verificar se está autenticado
- `getStoredUser()` - Obter usuário do localStorage

**Uso**:

```typescript
import authService from "@/services/auth.service";

// Login
const response = await authService.login("user@example.com", "password");

// Obter usuário
const user = await authService.getCurrentUser();

// Atualizar usuário
await authService.updateUser({ name: "Novo Nome" });

// Logout
authService.logout();

// Verificar autenticação
if (authService.isAuthenticated()) {
  // Está autenticado
}
```

### `estabelecimento.service.ts`

Serviço para gerenciar estabelecimentos (bares/pontos de venda):

- `getAll()` - Listar todos os estabelecimentos
- `getById(id)` - Obter estabelecimento por ID
- `create(data)` - Criar novo estabelecimento
- `update(id, data)` - Atualizar estabelecimento
- `delete(id)` - Deletar estabelecimento

**Uso**:

```typescript
import estabelecimentoService from "@/services/estabelecimento.service";

// Criar estabelecimento
const est = await estabelecimentoService.create({ nome: "Bar do João" });

// Obter um estabelecimento
const est = await estabelecimentoService.getById("est-123");
```

### `produto.service.ts`

Serviço para gerenciar produtos:

- `getAll(filters?, sortBy?, limit?)` - Listar produtos
- `getById(id)` - Obter produto por ID
- `create(data)` - Criar novo produto
- `update(id, data)` - Atualizar produto
- `delete(id)` - Deletar produto
- `getByEstabelecimento(estabelecimentoId)` - Listar produtos de um estabelecimento

**Uso**:

```typescript
import produtoService from "@/services/produto.service";

// Listar produtos
const produtos = await produtoService.getAll({
  estabelecimentoId: "est-123",
  categoria: "Cerveja",
});

// Criar produto
const produto = await produtoService.create({
  nome: "Skol 600ml",
  categoria: "Cerveja",
  volume: "600ml",
  estoqueAtual: 50,
  estoqueMinimo: 10,
  precoCompra: 2.5,
  precoVenda: 5.99,
  fornecedorId: "forn-123",
  estabelecimentoId: "est-123",
});

// Atualizar produto
await produtoService.update("prod-123", { estoqueAtual: 45 });

// Deletar produto
await produtoService.delete("prod-123");
```

### `movimentacao.service.ts`

Serviço para gerenciar movimentações de estoque:

- `getAll(filters?, sortBy?, limit?)` - Listar movimentações
- `getById(id)` - Obter movimentação por ID
- `create(data)` - Registrar nova movimentação
- `update(id, data)` - Atualizar movimentação
- `delete(id)` - Deletar movimentação
- `getByEstabelecimento(id)` - Listar movimentações de um estabelecimento
- `getByProduto(id)` - Listar movimentações de um produto

**Uso**:

```typescript
import movimentacaoService from "@/services/movimentacao.service";

// Registrar entrada
const mov = await movimentacaoService.create({
  produtoId: "prod-123",
  produtoNome: "Skol 600ml",
  tipo: "Entrada",
  quantidade: 24,
  data: "2025-02-19",
  observacao: "Compra do fornecedor",
  estabelecimentoId: "est-123",
});

// Listar movimentações
const movs = await movimentacaoService.getByEstabelecimento("est-123");
```

### `fornecedor.service.ts`

Serviço para gerenciar fornecedores:

- `getAll(filters?)` - Listar fornecedores
- `getById(id)` - Obter fornecedor por ID
- `create(data)` - Criar novo fornecedor
- `update(id, data)` - Atualizar fornecedor
- `delete(id)` - Deletar fornecedor
- `getByEstabelecimento(id)` - Listar fornecedores de um estabelecimento

**Uso**:

```typescript
import fornecedorService from "@/services/fornecedor.service";

// Criar fornecedor
const forn = await fornecedorService.create({
  nome: "Distribuidora ABC",
  telefone: "(11) 99999-9999",
  prazoEntregaDias: 3,
  estabelecimentoId: "est-123",
});

// Listar fornecedores
const fornecedores = await fornecedorService.getByEstabelecimento("est-123");
```

## Tratamento de Erros

Todos os serviços lançam erros em caso de falha. Use try/catch:

```typescript
try {
  const data = await produtoService.getAll();
} catch (error) {
  console.error("Erro ao carregar produtos:", error.message);
  // Mostrar mensagem de erro ao usuário
}
```

## Exemplo de Uso Completo em um Componente

```typescript
import React, { useState, useEffect } from "react";
import produtoService from "@/services/produto.service";

export default function MinhaComponente() {
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function carregar() {
      try {
        setLoading(true);
        const data = await produtoService.getByEstabelecimento("est-123");
        setProdutos(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    carregar();
  }, []);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div>
      {produtos.map(p => (
        <div key={p.id}>{p.nome}</div>
      ))}
    </div>
  );
}
```
