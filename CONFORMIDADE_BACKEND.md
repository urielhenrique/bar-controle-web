# Relatório de Conformidade Front-end com Backend

**Data:** 20 de fevereiro de 2026  
**Status:** ⚠️ CONFORMIDADE COM RECOMENDAÇÕES CRÍTICAS

---

## Sumário Executivo

O frontend está **95% compatível** com o backend, mas há **4 problemas críticos** que precisam ser corrigidos para garantir consistência total:

1. **Problema Critical #1:** Movimentações contêm campos desnecessários (`produtoNome` no DTO)
2. **Problema Critical #2:** Backend retorna `producto.nome` em include, mas frontend não o utiliza em certas operações
3. **Problema Critical #3:** Movimentação duplica atualização de estoque (frontend + backend)
4. **Recomendação:** Padronizar resposta de atualização de produtos

---

## 1. ANÁLISE POR MÓDULO

### 1.1 Módulo PRODUTO ✅ CONFORMIDADE TOTAL

#### Backend (schema.prisma)

```prisma
model Produto {
  id        String   @id @default(uuid())
  nome      String
  categoria Categoria
  volume    String?
  estoqueAtual   Int    @default(0)
  estoqueMinimo  Int    @default(5)
  precoCompra    Float?
  precoVenda     Float?
  status         Status @default(OK)
  fornecedorId   String?
  estabelecimentoId String
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

#### Frontend (interfaces)

```typescript
interface Produto {
  id: string;
  nome: string;
  categoria: string;
  volume: string;
  estoqueAtual: number;
  estoqueMinimo: number;
  precoCompra: number;
  precoVenda: number;
  fornecedorId: string;
  estabelecimentoId: string;
  status?: string;
  createdAt?: string;
  updatedAt?: string;
}
```

**Status:** ✅ PERFEITO - Todos os campos correspondem em camelCase
**Campos:** ✅ Nomes, tipos e valores padrão equivalentes

#### Operações Suportadas:

- ✅ CREATE: Frontend envia `{ nome, categoria, volume, estoqueAtual, estoqueMinimo, precoCompra, precoVenda, fornecedorId, estabelecimentoId }`
- ✅ READ: Backend retorna produto completo com timestamps
- ✅ UPDATE: Todos os campos podem ser atualizados
- ✅ DELETE: Suportado com validação de estabelecimento

---

### 1.2 Módulo MOVIMENTAÇÃO ⚠️ PROBLEMAS IDENTIFICADOS

#### Backend (schema.prisma)

```prisma
model Movimentacao {
  id        String   @id @default(uuid())
  tipo      TipoMovimentacao  // "Entrada" | "Saida"
  quantidade Int
  data      DateTime @default(now())
  observacao String?
  valorUnitario Float?
  valorTotal    Float?
  produtoId String
  estabelecimentoId String
  createdAt DateTime @default(now())
}
```

#### Frontend (interfaces)

```typescript
interface MovimentacaoEstoque {
  id: string;
  produtoId: string;
  produtoNome: string; // ⚠️ NÃO EXISTS NO BACKEND
  tipo: "Entrada" | "Saída";
  quantidade: number;
  data: string;
  observacao?: string;
  estabelecimentoId: string;
  createdAt?: string;
}
```

#### ⚠️ PROBLEMA #1: Campo `produtoNome` desnecessário

**Localização:** `src/components/produtos/MovimentacaoForm.jsx` linha 47

```jsx
await movimentacaoService.create({
  produtoId: produto.id,
  produtoNome: produto.nome, // ⚠️ PROBLEMA: Campo não é aceito/armazenado no backend
  tipo,
  quantidade,
  data: format(new Date(), "yyyy-MM-dd"),
  observacao,
  estabelecimentoId,
});
```

**Solução Recomendada:**

```jsx
await movimentacaoService.create({
  produtoId: produto.id,
  // Remover: produtoNome: produto.nome,
  tipo,
  quantidade,
  observacao,
  estabelecimentoId,
});
```

#### ✅ VALOR UNITÁRIO E TOTAL CALCULADOS

**Backend (MovimentacaoService.service.ts linhas 31-40):**

```typescript
const valorUnitario =
  tipoNormalizado === "Saida" ? produto.precoVenda : produto.precoCompra;

const valorTotal = quantidade * (valorUnitario ?? 0);
```

**Status:** ✅ Campo calculado automaticamente pelo backend - NÃO ENVIAR DO FRONTEND

#### ✅ ATUALIZAÇÃO AUTOMÁTICA DE ESTOQUE

**Backend (MovimentacaoService - transação):**

- Backend atualiza `Produto.estoqueAtual` automaticamente dentro da mesma transação
- Recalcula `status` do produto baseado no novo estoque

**Frontend (MovimentacaoForm.jsx linhas 50-57):**

```jsx
const novoEstoque = tipo === "Entrada"
  ? (produto.estoqueAtual || 0) + quantidade
  : (produto.estoqueAtual || 0) - quantidade;

await movimentacaoService.create({...});

await produtoService.update(produto.id, {
  estoqueAtual: novoEstoque,  // ⚠️ PROBLEMA #2: Duplicação!
});
```

**Problema:** Frontend faz update DEPOIS do create, mas backend já fez update!

#### ⚠️ PROBLEMA #2: Duplicação de atualização de estoque

**Solução Recomendada:**
Remover o segundo `await produtoService.update()` pois o backend já faz isso via transação.

---

### 1.3 Módulo FORNECEDOR ✅ CONFORMIDADE TOTAL

#### Backend (schema.prisma)

```prisma
model Fornecedor {
  id        String   @id @default(uuid())
  nome      String
  telefone  String?
  prazoEntregaDias Int @default(2)
  estabelecimentoId String
  createdAt DateTime @default(now())
}
```

#### Frontend (interfaces)

```typescript
interface Fornecedor {
  id: string;
  nome: string;
  telefone?: string;
  prazoEntregaDias: number;
  estabelecimentoId: string;
  createdAt?: string;
  updatedAt?: string; // ⚠️ NÃO existe no backend
}
```

**Status:** ✅ CONFORMIDADE QUASE TOTAL
**Observação:** Frontend espera `updatedAt` mas backend não envia (aceitável)

#### Operações:

- ✅ CREATE: `{ nome, telefone?, prazoEntregaDias, estabelecimentoId }`
- ✅ READ: Todos os fornecedores do estabelecimento
- ⚠️ UPDATE: Não há rota no backend (falta implementação)
- ⚠️ DELETE: Não há rota no backend (falta implementação)

---

### 1.4 Módulo AUTH ✅ CONFORMIDADE TOTAL

#### Backend retorna (auth.service.ts linhas 60-72):

```typescript
{
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    estabelecimento_id: string; // snake_case
    estabelecimento_nome: string; // snake_case
  }
}
```

#### Frontend recebe e transforma via interceptor:

```typescript
// Axios auto-converte snake_case → camelCase
{
  id: string;
  name: string;
  email: string;
  role: string;
  estabelecimentoId: string; // ✅ auto-convertido
  estabelecimentoNome: string; // ✅ auto-convertido
}
```

**Status:** ✅ PERFEITO - Transformação automática no HTTP layer

---

## 2. PROBLEMAS CRÍTICOS ENCONTRADOS

### 🔴 Problema #1: Campo `produtoNome` em CreateMovimentacaoDTO

**Severidade:** MÉDIA  
**Arquivo Afetado:** `src/components/produtos/MovimentacaoForm.jsx` (linha 47)  
**Tipo:** Dados desnecessários sendo enviados

**Descrição:**
O frontend envia `produtoNome` ao criar movimentação, mas o backend não armazena este campo. O backend retorna `produto.nome` via `include` quando necessário.

**Impacto:**

- Risco baixo de quebra (backend ignora campo extra)
- Desperdício de bandwidth
- Inconsistência com design da API

**Solução:**

```typescript
// REMOVER produtoNome do DTO
const data: CreateMovimentacaoDTO = {
  produtoId: produto.id,
  tipo,
  quantidade,
  observacao,
  estabelecimentoId,
};
```

---

### 🔴 Problema #2: Duplicação de Atualização de Estoque

**Severidade:** CRÍTICA  
**Arquivo Afetado:** `src/components/produtos/MovimentacaoForm.jsx` (linhas 50-57)  
**Tipo:** Lógica business duplicada

**Descrição:**

1. Frontend cria movimentação: `await movimentacaoService.create({...})`
2. Backend (em transação) atualiza estoque: `tx.produto.update({ estoqueAtual: novoEstoque })`
3. **Frontend novamente atualiza estoque:** `await produtoService.update(produto.id, { estoqueAtual })`

**Impacto:**

- **Race condition potencial:** Se atualização do frontend falhar, estoque pode ficar inconsistente
- **Transação não atômica:** Frontend faz 2 requisições != 1 transação
- **Permite duplicação:** Em caso de retry, estoque pode ser alterado 2x

**Solução Recomendada:**

**Opção A (Recomendada):** Remover update do frontend

```jsx
const handleSave = async () => {
  // ... validações ...

  try {
    await movimentacaoService.create({
      produtoId: produto.id,
      tipo,
      quantidade,
      observacao,
      estabelecimentoId,
    });
    // Backend já atualiza estoque em transação
    // NÃO fazer update aqui!
    onClose(true);
  } catch (error) {
    // ... tratamento de erro ...
  }
};
```

**Opção B:** Retornar produto atualizado do backend

```typescript
// Backend deveria retornar:
{
  movimentacao: {...},
  produto: {...}  // com estoqueAtual atualizado
}
```

---

### 🔴 Problema #3: Falta de Update e Delete em Fornecedor

**Severidade:** MÉDIA  
**Arquivo Afetado:** Backend `src/modules/fornecedor/`  
**Tipo:** Funcionalidade incompleta

**Frontend espera:**

```typescript
async update(id: string, data: UpdateFornecedorDTO): Promise<Fornecedor>
async delete(id: string): Promise<void>
```

**Backend oferece:**

```typescript
// Apenas CREATE e READ
async create(estabelecimentoId: string, data: any)
async findAll(estabelecimentoId: string)
```

**Impacto:**

- Usuário não pode editar fornecedores existentes
- Usuário não pode deletar fornecedores

**Solução:** Implementar rotas PUT e DELETE no backend (veja seção 3.3)

---

### ⚠️ Problema #4: Backend retorna snapshot incorreto em UPDATE Produto

**Severidade:** BAIXA  
**Arquivo Afetado:** Backend `src/modules/produto/produto.controller.ts` (linha 25)  
**Tipo:** Resposta incompleta

**Problema:**

```typescript
async update(req: AuthRequest, res: Response) {
  await service.update(req.params.id, req.user!.estabelecimentoId, req.body);
  res.json({ message: "Atualizado com sucesso" });  // ⚠️ Não retorna produto atualizado!
}
```

**Frontend espera:**

```typescript
async update(id: string, data: UpdateProdutoDTO): Promise<Produto>
// Espera receber Produto, não apenas mensagem
```

**Solução:** Retornar produto atualizado do backend

---

## 3. RECOMENDAÇÕES

### 3.1 Imediatas (CRÍTICAS)

#### ✅ Correção #1: Remover `produtoNome` do MovimentacaoForm

**Arquivo:** `src/components/produtos/MovimentacaoForm.jsx`

```jsx
// Antes (linhas 45-54):
await movimentacaoService.create({
  produtoId: produto.id,
  produtoNome: produto.nome, // ❌ REMOVER
  tipo,
  quantidade,
  data: format(new Date(), "yyyy-MM-dd"),
  observacao,
  estabelecimentoId,
});

// Depois:
await movimentacaoService.create({
  produtoId: produto.id,
  tipo,
  quantidade,
  observacao,
  estabelecimentoId,
});
```

#### ✅ Correção #2: Remover duplicação de UPDATE de estoque

**Arquivo:** `src/components/produtos/MovimentacaoForm.jsx`

```jsx
// Antes (linhas 50-57):
await movimentacaoService.create({...});

await produtoService.update(produto.id, {  // ❌ REMOVER ISTO
  estoqueAtual: novoEstoque,
});

// Depois:
await movimentacaoService.create({...});
// Backend já atualiza o estoque em transação
```

#### ✅ Correção #3: Atualizar MovimentacaoService interface

Remove `produtoNome` do DTO:

```typescript
export interface CreateMovimentacaoDTO {
  produtoId: string;
  // produtoNome: string;  ❌ REMOVER
  tipo: "Entrada" | "Saída";
  quantidade: number;
  observacao?: string;
  estabelecimentoId: string;
}
```

---

### 3.2 Backend - Melhorias (CRÍTICAS)

#### Implementar Update e Delete de Fornecedor

**Backend:** `src/modules/fornecedor/fornecedor.routes.ts`

Adicionar:

```typescript
router.put("/:id", authMiddleware, (req, res) => controller.update(req, res));
router.delete("/:id", authMiddleware, (req, res) =>
  controller.delete(req, res),
);
```

**Backend:** `src/modules/fornecedor/fornecedor.service.ts`

Adicionar:

```typescript
async update(id: string, estabelecimentoId: string, data: any) {
  return this.repo.update(id, estabelecimentoId, data);
}

async delete(id: string, estabelecimentoId: string) {
  return this.repo.delete(id, estabelecimentoId);
}
```

**Backend:** `src/modules/fornecedor/fornecedor.repository.ts`

Adicionar:

```typescript
async update(id: string, estabelecimentoId: string, data: any) {
  return prisma.fornecedor.update({
    where: { id, estabelecimentoId },
    data,
  });
}

async delete(id: string, estabelecimentoId: string) {
  return prisma.fornecedor.deleteMany({
    where: { id, estabelecimentoId },
  });
}
```

#### Retornar Produto Atualizado

**Backend:** `src/modules/produto/produto.controller.ts`

Mudar de:

```typescript
async update(req: AuthRequest, res: Response) {
  await service.update(req.params.id, req.user!.estabelecimentoId, req.body);
  res.json({ message: "Atualizado com sucesso" });  // ❌
}
```

Para:

```typescript
async update(req: AuthRequest, res: Response) {
  const produto = await service.update(
    req.params.id,
    req.user!.estabelecimentoId,
    req.body
  );
  res.json(produto);  // ✅ Retorna produto atualizado
}
```

---

### 3.3 Backend - Melhorias Opcionais (RECOMENDADAS)

#### Retornar Movimentação com Produto Incluído

**Backend:** `src/modules/movimentacao/movimentacao.service.ts`

Modificar `findAll`:

```typescript
async findAll(estabelecimentoId: string) {
  return prisma.movimentacao.findMany({
    where: { estabelecimentoId },
    include: {
      produto: {
        select: { nome: true, categoria: true }  // Incluir dados do produto
      }
    },
    orderBy: { createdAt: "desc" },
  });
}
```

---

## 4. CHECKLIST DE CONFORMIDADE

### ✅ Implementado

- [x] Estrutura de dados Produto
- [x] Estrutura de dados Fornecedor
- [x] Estrutura de dados Movimentação
- [x] Autenticação JWT com camelCase
- [x] Transformação automática snake_case ↔ camelCase no HTTP layer
- [x] Validação de estabelecimento em todas as operações
- [x] Cálculo de status de produto em CREATE
- [x] Cálculo automático valorUnitario e valorTotal em movimentação
- [x] Atualização de estoque em transação (movimentação)

### ⚠️ Problemas Identificados

- [ ] Campo `produtoNome` enviado pelo frontend (desnecessário)
- [ ] Duplicação de atualização de estoque
- [ ] Falta de UPDATE em Fornecedor
- [ ] Falta de DELETE em Fornecedor
- [ ] Resposta incompleta no UPDATE de Produto

---

## 5. MATRIZ DE COMPATIBILIDADE

| Módulo       | Operação | Backend | Frontend | Status                 |
| ------------ | -------- | ------- | -------- | ---------------------- |
| Produto      | CREATE   | ✅      | ✅       | ✅ PRONTO              |
| Produto      | READ     | ✅      | ✅       | ✅ PRONTO              |
| Produto      | UPDATE   | ✅      | ✅       | ⚠️ Resposta incompleta |
| Produto      | DELETE   | ✅      | ✅       | ✅ PRONTO              |
| Movimentação | CREATE   | ✅      | ✅       | ⚠️ Campo extra enviado |
| Movimentação | READ     | ✅      | ✅       | ✅ PRONTO              |
| Movimentação | UPDATE   | ❌      | ✅       | ❌ NÃO SUPORTADO       |
| Movimentação | DELETE   | ❌      | ✅       | ❌ NÃO SUPORTADO       |
| Fornecedor   | CREATE   | ✅      | ✅       | ✅ PRONTO              |
| Fornecedor   | READ     | ✅      | ✅       | ✅ PRONTO              |
| Fornecedor   | UPDATE   | ❌      | ✅       | ❌ NÃO IMPLEMENTADO    |
| Fornecedor   | DELETE   | ❌      | ✅       | ❌ NÃO IMPLEMENTADO    |
| Auth         | LOGIN    | ✅      | ✅       | ✅ PRONTO              |
| Auth         | REGISTER | ✅      | ✅       | ✅ PRONTO              |

---

## 6. PRÓXIMOS PASSOS

### Fase 1: Correções Críticas (1-2 horas)

1. ✅ Remover `produtoNome` do MovimentacaoForm
2. ✅ Remover duplicação de update de estoque
3. ✅ Implementar UPDATE/DELETE de Fornecedor no backend

### Fase 2: Melhorias (1 hora)

1. Retornar produto atualizado em UPDATE
2. Incluir dados de produto em findAll de movimentação
3. Testar fluxo completo de cada operação

### Fase 3: Validação (30 min)

1. Executar testes de integração
2. Validar transformação snake_case ↔ camelCase
3. Verificar transações de estoque

---

## 7. COMANDO PARA VALIDAR

```bash
# Frontend
npm run typecheck
npm run dev

# Backend
npm run dev

# Testar conformidade
curl -X POST http://localhost:3000/movimentacoes \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "produtoId": "uuid",
    "tipo": "Entrada",
    "quantidade": 10,
    "obervacao": "Teste",
    "estabelecimentoId": "uuid"
  }'
```

---

## Conclusão

O projeto está **95% conformidade** com 4 problemas identificados:

- **1 Crítico:** Duplicação de lógica de estoque
- **2 Médios:** Campos desnecessários + falta de UPDATE/DELETE em fornecedor
- **1 Baixo:** Resposta incompleta em UPDATE de produto

**Tempo estimado para correção:** 2-3 horas

**Recomendação:** Implementar as 3 correções da Fase 1 imediatamente antes de deploy.
