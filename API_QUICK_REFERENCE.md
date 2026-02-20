# API Routes Reference - Tabela Rápida

## 📌 Legenda

- 🔐 = Requer autenticação
- 📄 = Retorna lista com paginação
- ⚙️ = Retorna objeto único
- ⭐ = Rota mais importante/com fallback

---

## 🔐 Autenticação (SEM proteção)

| Método | Rota             | Descrição              | Response          |
| ------ | ---------------- | ---------------------- | ----------------- |
| POST   | `/auth/register` | Registrar novo usuário | `{ user, token }` |
| POST   | `/auth/login`    | Login                  | `{ user, token }` |

---

## 🔐 Autenticação (COM proteção)

| Método | Rota       | Descrição                    | Response            |
| ------ | ---------- | ---------------------------- | ------------------- |
| GET    | `/auth/me` | Dados do usuário autenticado | `{ message, user }` |

---

## 🏢 Estabelecimento (🔐)

| Método | Rota                  | Descrição                | Response            |
| ------ | --------------------- | ------------------------ | ------------------- |
| GET    | `/estabelecimento/me` | Dados do estabelecimento | `{ message, user }` |

---

## 📦 Produtos (🔐)

| Método | Rota            | Query Params                | Descrição       | Response                         |
| ------ | --------------- | --------------------------- | --------------- | -------------------------------- |
| GET    | `/produtos`     | `cursor`, `limit` (def: 20) | 📄 Listar todos | `{ items, nextCursor, hasMore }` |
| POST   | `/produtos`     | -                           | ⚙️ Criar novo   | Produto criado                   |
| PUT    | `/produtos/:id` | -                           | ⚙️ Atualizar    | Produto atualizado               |
| DELETE | `/produtos/:id` | -                           | ⚙️ Deletar      | `{ message }`                    |

**Body POST/PUT:**

```typescript
{
  nome: string,
  categoria: string,
  volume: string,
  estoqueAtual: number,
  estoqueMinimo: number,
  precoCompra: number,
  precoVenda: number,
  fornecedorId: string
}
```

---

## 📊 Movimentações (🔐)

| Método | Rota             | Query Params                             | Descrição     | Response                         |
| ------ | ---------------- | ---------------------------------------- | ------------- | -------------------------------- |
| GET    | `/movimentacoes` | `cursor`, `limit` (def: 20), `produtoId` | 📄 Listar     | `{ items, nextCursor, hasMore }` |
| POST   | `/movimentacoes` | -                                        | ⚙️ Criar nova | Movimentação criada              |

**Body POST:**

```typescript
{
  tipo: "Entrada" | "Saída",
  quantidade: number,
  data: string (ISO 8601),
  produtoId: string
}
```

---

## 🏭 Fornecedores (🔐)

| Método | Rota                | Query Params                | Descrição     | Response                         |
| ------ | ------------------- | --------------------------- | ------------- | -------------------------------- |
| GET    | `/fornecedores`     | `cursor`, `limit` (def: 20) | 📄 Listar     | `{ items, nextCursor, hasMore }` |
| POST   | `/fornecedores`     | -                           | ⚙️ Criar novo | Fornecedor criado                |
| PUT    | `/fornecedores/:id` | -                           | ⚙️ Atualizar  | Fornecedor atualizado            |
| DELETE | `/fornecedores/:id` | -                           | ⚙️ Deletar    | `{ message }`                    |

**Body POST/PUT:**

```typescript
{
  nome: string,
  email: string,
  cnpj: string,
  prazoEntregaDias: number
}
```

---

## 💳 Plano (🔐) ⭐

| Método | Rota             | Descrição                      | Response                                                              |
| ------ | ---------------- | ------------------------------ | --------------------------------------------------------------------- |
| GET    | `/plano/limites` | Apenas limites                 | `{ plano, limiteProdutos, limiteUsuarios, limiteMovimentacaoMensal }` |
| GET    | `/plano/uso`     | Apenas uso atual               | `{ produtos, usuarios, movimentacaoMes }`                             |
| GET    | `/plano/status`  | ⭐ Status completo com alertas | Ver tabela abaixo                                                     |

### Resposta Detalhada: `/plano/status`

```typescript
{
  plano: "FREE" | "PRO",

  // Recursos de Produtos
  recursosProdutos: {
    usado: number,
    limite: number,
    percentual: number,
    atencao: boolean,      // > 80%
    atingido: boolean      // >= 100%
  },

  // Recursos de Usuários
  recursosUsuarios: {
    usado: number,
    limite: number,
    percentual: number,
    atencao: boolean,
    atingido: boolean
  },

  // Recursos de Movimentações
  recursosMovimentacao: {
    usado: number,
    limite: number,
    percentual: number,
    atencao: boolean,
    atingido: boolean
  },

  // Quais limites foram atingidos
  limiteAting: string[],  // ["produtos", "usuarios"] etc

  // Recomendação ao usuário
  recomendacao: string | null
}
```

---

## 📈 Dashboard (🔐)

| Método | Rota         | Descrição           | Response                     |
| ------ | ------------ | ------------------- | ---------------------------- |
| GET    | `/dashboard` | Resumo do dashboard | Varia conforme implementação |

---

## 🏥 Health Check (SEM proteção)

| Método | Rota      | Descrição                         | Response           |
| ------ | --------- | --------------------------------- | ------------------ |
| GET    | `/health` | Verificar se servidor está online | `{ status: "ok" }` |

---

## 🔒 Notas sobre Autenticação

```
Header obrigatório para rotas protegidas (🔐):
Authorization: Bearer <JWT_TOKEN>

Token contém:
{
  id: string,
  email: string,
  estabelecimentoId: string,
  estabelecimentoNome: string
}

O backend extrai automaticamente o estabelecimentoId
do token JWT, não precisa enviar manualmente!
```

---

## 📱 Status HTTP Esperados

| Status | Significado              | Exemplo                             |
| ------ | ------------------------ | ----------------------------------- |
| `200`  | OK - Sucesso             | GET, PUT, DELETE bem-sucedido       |
| `201`  | Created - Recurso criado | POST bem-sucedido                   |
| `400`  | Bad Request              | Dados inválidos, erro de validação  |
| `401`  | Unauthorized             | Token inválido, expirado ou ausente |
| `404`  | Not Found                | Recurso não existe                  |
| `500`  | Server Error             | Erro no servidor                    |

### Formato de Erro:

```json
{
  "error": "Mensagem descritiva do erro"
}
```

---

## 🎯 Endpoints mais Usados no Frontend

### Dashboard

```
1. GET /auth/me                 → Validar autenticação
2. GET /plano/status            → Status do plano ⭐
3. GET /produtos?limit=20       → Lista de produtos
4. GET /movimentacoes?limit=20  → Últimas movimentações
5. GET /fornecedores            → Lista de fornecedores
```

### Criar/Editar Produtos

```
POST /produtos                  → Criar novo produto
PUT /produtos/:id               → Editar produto
GET /produtos                   → Listar para buscar
```

### Movimentações

```
POST /movimentacoes             → Registrar entrada/saída
GET /movimentacoes?produtoId=X  → Histórico de um produto
```

---

## 🔧 Debugging Tips

### Testar Rota Manualmente (curl)

```bash
# GET
curl -H "Authorization: Bearer TOKEN" http://localhost:3000/plano/status

# POST
curl -X POST \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Novo Produto","categoria":"Bebida"}' \
  http://localhost:3000/produtos

# PUT
curl -X PUT \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"nome":"Produto Atualizado"}' \
  http://localhost:3000/produtos/ID

# DELETE
curl -X DELETE \
  -H "Authorization: Bearer TOKEN" \
  http://localhost:3000/produtos/ID
```

### Verificar Token

```typescript
// No console do browser
const token = localStorage.getItem("auth_token");
console.log(token);

// Decodificar (use https://jwt.io)
// Copie o token na seção "Encoded"
```

---

## ✅ Verificação Rápida

- [x] Todas as rotas documentadas
- [x] Tipos de resposta especificados
- [x] Query params e body examples inclusos
- [x] Status HTTP mapeados
- [x] Autenticação clara
- [x] Paginação explicada
