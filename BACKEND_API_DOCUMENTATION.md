# Documentação Completa das APIs do Backend

## Base URL
`http://localhost:3000`

---

## 🔐 Autenticação

Todas as rotas (exceto `/auth/register` e `/auth/login`) requerem:
```
Authorization: Bearer <token>
```

O token é extraído do header e o `estabelecimentoId` é obtido automaticamente.

---

## 📋 Rotas Disponíveis

### 1️⃣ AUTH (`/auth`)

#### POST `/auth/register`
Registrar novo usuário
```
sem autenticação obrigatória
Body: { email, password, name, estabelecimentoNome }
Response: { user, token }
```

#### POST `/auth/login`
Login
```
sem autenticação obrigatória
Body: { email, password }
Response: { user, token }
```

#### GET `/auth/me`
Dados do usuário autenticado
```
requer: Authorization header
Response: { message, user }
```

---

### 2️⃣ ESTABELECIMENTO (`/estabelecimento`)

#### GET `/estabelecimento/me`
Dados do estabelecimento do usuário
```
requer: Authorization header
Response: { message, user }
```

---

### 3️⃣ PRODUTOS (`/produtos`)

#### GET `/produtos`
Listar todos os produtos
```
requer: Authorization header
Query params (opcionais):
  - cursor: string (para paginação)
  - limit: number (padrão: 20)

Response: {
  items: [
    {
      id,
      nome,
      categoria,
      volume,
      estoqueAtual,
      estoqueMinimo,
      precoCompra,
      precoVenda,
      fornecedorId,
      estabelecimentoId,
      createdAt,
      updatedAt
    }
  ],
  nextCursor: string | null,
  hasMore: boolean
}
```

#### POST `/produtos`
Criar novo produto
```
requer: Authorization header
Body: {
  nome,
  categoria,
  volume,
  estoqueAtual,
  estoqueMinimo,
  precoCompra,
  precoVenda,
  fornecedorId
}

Response: produto criado (objeto completo)
```

#### PUT `/produtos/:id`
Atualizar produto
```
requer: Authorization header
Params: id do produto
Body: { campos a atualizar }

Response: produto atualizado
```

#### DELETE `/produtos/:id`
Deletar produto
```
requer: Authorization header
Params: id do produto

Response: { message: "Deletado com sucesso" }
```

---

### 4️⃣ MOVIMENTAÇÕES (`/movimentacoes`)

#### GET `/movimentacoes`
Listar movimentações
```
requer: Authorization header
Query params (opcionais):
  - cursor: string (para paginação)
  - limit: number (padrão: 20)
  - produtoId: string (filtro por produto)

Response: {
  items: [
    {
      id,
      tipo,        // "Entrada" | "Saída"
      quantidade,
      data,
      produtoId,
      estabelecimentoId,
      createdAt,
      updatedAt
    }
  ],
  nextCursor,
  hasMore
}
```

#### POST `/movimentacoes`
Criar movimentação
```
requer: Authorization header
Body: {
  tipo,         // "Entrada" | "Saída"
  quantidade,
  data,
  produtoId
}

Response: movimentação criada
```

---

### 5️⃣ FORNECEDORES (`/fornecedores`)

#### GET `/fornecedores`
Listar fornecedores
```
requer: Authorization header
Query params (opcionais):
  - cursor: string
  - limit: number (padrão: 20)

Response: {
  items: [
    {
      id,
      nome,
      email,
      cnpj,
      prazoEntregaDias,
      estabelecimentoId,
      createdAt,
      updatedAt
    }
  ],
  nextCursor,
  hasMore
}
```

#### POST `/fornecedores`
Criar fornecedor
```
requer: Authorization header
Body: {
  nome,
  email,
  cnpj,
  prazoEntregaDias
}

Response: fornecedor criado
```

#### PUT `/fornecedores/:id`
Atualizar fornecedor
```
requer: Authorization header
Params: id
Body: { campos a atualizar }

Response: fornecedor atualizado
```

#### DELETE `/fornecedores/:id`
Deletar fornecedor
```
requer: Authorization header
Params: id

Response: { message: "Deletado com sucesso" }
```

---

### 6️⃣ PLANO (`/plano`)

#### GET `/plano/limites`
Apenas os limites do plano
```
requer: Authorization header

Response: {
  plano: "FREE" | "PRO",
  limiteProdutos: number,
  limiteUsuarios: number,
  limiteMovimentacaoMensal: number
}
```

#### GET `/plano/uso`
Apenas o uso atual
```
requer: Authorization header

Response: {
  produtos: number,
  usuarios: number,
  movimentacaoMes: number
}
```

#### GET `/plano/status` ⭐ PRINCIPAL
Status completo com alertas
```
requer: Authorization header

Response: {
  plano: "FREE" | "PRO",
  
  recursosProdutos: {
    usado: number,
    limite: number,
    percentual: number,
    atencao: boolean (>= 80%),
    atingido: boolean (>= 100%)
  },
  
  recursosUsuarios: {
    usado: number,
    limite: number,
    percentual: number,
    atencao: boolean,
    atingido: boolean
  },
  
  recursosMovimentacao: {
    usado: number,
    limite: number,
    percentual: number,
    atencao: boolean,
    atingido: boolean
  },
  
  limiteAting: string[] (quais foram atingidos),
  recomendacao: string | null
}
```

---

### 7️⃣ DASHBOARD (`/dashboard`)

#### GET `/dashboard`
Resumo do dashboard
```
requer: Authorization header

Response: {
  // Estrutura depende da implementação no backend
}
```

---

## 🔧 Estrutura de Autenticação

### Token JWT
- Contém: `id`, `email`, `estabelecimentoId`, `estabelecimentoNome`
- Armazenado em: `localStorage.auth_token`
- Middleware: `authMiddleware` valida e extrai dados

---

## 📝 Diferenças Importantes para o Frontend

### ⚠️ PLANO - Mapeamento de Campos

**Backend retorna:**
```typescript
{
  plano,
  recursosProdutos: { usado, limite, percentual, atencao, atingido },
  recursosUsuarios: { usado, limite, percentual, atencao, atingido },
  recursosMovimentacao: { usado, limite, percentual, atencao, atingido },
  limiteAting,
  recomendacao
}
```

**Seu frontend espera:**
```typescript
{
  plano,
  limites: { produtos, usuarios, movimentacoesMes },
  uso: { produtos, usuarios, movimentacoesMes },
  percentuais: (calculado no hook)
}
```

**Solução:** Adaptar o hook `usePlano` para mapear a resposta corretamente!

---

## 📊 Paginação

Endpoints com paginação usam cursor (não offset):
- `cursor`: token para próxima página
- `limit`: quantidade de itens (padrão 20)
- `hasMore`: indica se há mais registros
- `nextCursor`: valor para próxima requisição

**Exemplo:**
```
GET /produtos?cursor=abc123&limit=20

Response:
{
  items: [...],
  nextCursor: "def456" | null,
  hasMore: true | false
}
```

---

## 🚨 Tratamento de Erros

Todas as APIs retornam erros no formato:
```json
{
  "error": "Mensagem descritiva do erro"
}
```

Status HTTP:
- `201`: Created (POST bem-sucedido)
- `200`: OK (GET/PUT bem-sucedido)
- `400`: Bad Request (erro de validação)
- `401`: Unauthorized (token inválido/expirado)
- `404`: Not Found
- `500`: Server Error

---

## 📌 Resumo de Diferenças

| Aspecto | Backend | Frontend (atual) |
|---------|---------|-----------------|
| Plano - Limites | `limiteProdutos` | `limites.produtos` |
| Plano - Uso | `produtos` | `uso.produtos` |
| Plano - Estrutura | Aninhada por recurso | Simples |
| Movimentação data | Precisa enviar | Extraído do contexto |
| Paginação | Cursor-based | Espera lista simples |

