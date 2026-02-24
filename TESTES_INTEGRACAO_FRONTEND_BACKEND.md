# 🧪 Testes de Integração Frontend + Backend

Guia para testar a integração entre os validadores frontend e backend.

---

## 🎯 Tipos de Testes

```
┌──────────────────────────────────────────────────┐
│              TESTES DE VALIDAÇÃO                 │
├──────────────────────────────────────────────────┤
│                                                  │
│  1. UNITÁRIOS (Validadores)                      │
│     └─> Cada função isolada                      │
│                                                  │
│  2. INTEGRAÇÃO (Frontend)                        │
│     └─> Validador + Hook + Componente            │
│                                                  │
│  3. INTEGRAÇÃO (Backend)                         │
│     └─> API + Banco de dados                     │
│                                                  │
│  4. E2E (Frontend + Backend)                     │
│     └─> Usuário clica → Salva no banco           │
│                                                  │
└──────────────────────────────────────────────────┘
```

---

## 1️⃣ Testes Unitários - Validadores

### Setup

```bash
npm install --save-dev vitest @vitest/ui
```

### Executar

```bash
npm run test                    # Rodar uma vez
npm run test -- --watch        # Modo watch
npm run test -- --ui           # UI do Vitest
```

### Arquivo: `src/utils/validators.test.ts`

```typescript
import { describe, it, expect } from "vitest";
import {
  validateProductName,
  validatePrice,
  validateEmail,
  sanitizeInput,
} from "./validators";

describe("Validadores", () => {
  describe("validateProductName", () => {
    it("deveria aceitar nome válido", () => {
      const result = validateProductName("Skol 600ml");
      expect(result.isValid).toBe(true);
    });

    it("deveria rejeitar nome muito curto", () => {
      const result = validateProductName("ab");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("mínimo");
    });

    it("deveria rejeitar caracteres inválidos", () => {
      const result = validateProductName("Skol @#$%");
      expect(result.isValid).toBe(false);
    });

    it("deveria não permitir vazio", () => {
      const result = validateProductName("");
      expect(result.isValid).toBe(false);
    });
  });

  describe("validatePrice", () => {
    it("deveria aceitar preço válido", () => {
      const result = validatePrice(10.5);
      expect(result.isValid).toBe(true);
    });

    it("deveria rejeitar preço negativo", () => {
      const result = validatePrice(-5);
      expect(result.isValid).toBe(false);
    });

    it("deveria rejeitar preço zero", () => {
      const result = validatePrice(0);
      expect(result.isValid).toBe(false);
    });

    it("deveria rejeitar preço muito grande", () => {
      const result = validatePrice(1000000);
      expect(result.isValid).toBe(false);
    });
  });

  describe("sanitizeInput", () => {
    it("deveria remover tags HTML", () => {
      const input = "Texto <script>alert('xss')</script>";
      const result = sanitizeInput(input);
      expect(result).not.toContain("<script>");
    });

    it("deveria remover event listeners", () => {
      const input = '<img src="x" onerror="alert()">';
      const result = sanitizeInput(input);
      expect(result).not.toContain("onerror");
    });

    it("deveria preservar texto válido", () => {
      const input = "Cerveja Premium";
      const result = sanitizeInput(input);
      expect(result).toBe(input);
    });

    it("deveria remover javascript:", () => {
      const input = '<a href="javascript:void(0)">link</a>';
      const result = sanitizeInput(input);
      expect(result).not.toContain("javascript:");
    });
  });

  describe("validateEmail", () => {
    it("deveria aceitar email válido", () => {
      const result = validateEmail("usuario@exemplo.com");
      expect(result.isValid).toBe(true);
    });

    it("deveria rejeitar email sem @", () => {
      const result = validateEmail("usuarioexemplo.com");
      expect(result.isValid).toBe(false);
    });

    it("deveria rejeitar email com espaço", () => {
      const result = validateEmail("usuario @exemplo.com");
      expect(result.isValid).toBe(false);
    });

    it("deveria rejeitar email vazio", () => {
      const result = validateEmail("");
      expect(result.isValid).toBe(false);
    });
  });
});
```

### Rodar Testes

```bash
npm run test -- --reporter=verbose

# Output:
# ✓ src/utils/validators.test.ts (47 tests) 234ms
#   ✓ Validadores (47)
#     ✓ validateProductName (4)
#       ✓ deveria aceitar nome válido
#       ✓ deveria rejeitar nome muito curto
#       ✓ deveria rejeitar caracteres inválidos
#       ✓ deveria não permitir vazio
#     ✓ validateEmail (4)
#       ...
```

---

## 2️⃣ Testes de Integração - Frontend

### Teste com Vitest + React Testing Library

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

### Arquivo: `src/components/shared/FormInput.test.jsx`

```javascript
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FormInput from "./FormInput";

describe("<FormInput />", () => {
  it("deveria renderizar input com label", () => {
    render(<FormInput label="Nome" name="nome" value="" onChange={() => {}} />);

    expect(screen.getByLabelText("Nome")).toBeInTheDocument();
  });

  it("deveria mostrar erro quando fornecido", () => {
    render(
      <FormInput
        label="Nome"
        name="nome"
        value=""
        error="Nome é obrigatório"
        onChange={() => {}}
      />,
    );

    expect(screen.getByText("Nome é obrigatório")).toBeInTheDocument();
  });

  it("deveria não mostrar erro quando não fornecido", () => {
    const { container } = render(
      <FormInput label="Nome" name="nome" value="João" onChange={() => {}} />,
    );

    expect(container.querySelector(".text-red-600")).not.toBeInTheDocument();
  });

  it("deveria chamar onChange quando valor muda", async () => {
    const handleChange = vi.fn();

    render(
      <FormInput label="Nome" name="nome" value="" onChange={handleChange} />,
    );

    const input = screen.getByLabelText("Nome");
    await userEvent.type(input, "João");

    expect(handleChange).toHaveBeenCalled();
  });

  it("deveria mostrar contador de caracteres", () => {
    render(
      <FormInput
        label="Nome"
        name="nome"
        value="João"
        maxLength={100}
        onChange={() => {}}
      />,
    );

    expect(screen.getByText(/4\/100/)).toBeInTheDocument();
  });
});
```

### Teste com Hook

```javascript
import { describe, it, expect, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateProductName, validatePrice } from "@/utils/validators";

describe("useFormValidation", () => {
  it("deveria inicializar com valores", () => {
    const { result } = renderHook(() =>
      useFormValidation(
        { nome: "Skol", preco: 5.5 },
        { nome: validateProductName, preco: validatePrice },
      ),
    );

    expect(result.current.values.nome).toBe("Skol");
    expect(result.current.values.preco).toBe(5.5);
  });

  it("deveria atualizar valor ao chamar handleChange", () => {
    const { result } = renderHook(() =>
      useFormValidation({ nome: "" }, { nome: validateProductName }),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "nome", value: "Cerveja" },
      });
    });

    expect(result.current.values.nome).toBe("Cerveja");
  });

  it("deveria validar campo após onChange", () => {
    const { result } = renderHook(() =>
      useFormValidation(
        { nome: "" },
        {
          nome: {
            validator: validateProductName,
            validateOnChange: true,
          },
        },
      ),
    );

    act(() => {
      result.current.handleChange({
        target: { name: "nome", value: "a" }, // Muito curto
      });
    });

    expect(result.current.errors.nome).toBeDefined();
  });

  it("deveria permitir submit apenas se válido", () => {
    const { result } = renderHook(() =>
      useFormValidation(
        { nome: "", preco: "" },
        {
          nome: validateProductName,
          preco: validatePrice,
        },
      ),
    );

    // Inválido (vazio)
    expect(result.current.isValid).toBe(false);

    // Tornar válido
    act(() => {
      result.current.setFieldValue("nome", "Cerveja");
      result.current.setFieldValue("preco", 5.5);
    });

    expect(result.current.isValid).toBe(true);
  });
});
```

---

## 3️⃣ Testes de Integração - Backend

### Node.js + Jest + Supertest

```bash
npm install --save-dev jest supertest
```

### Arquivo: `backend/tests/api.produtos.test.js`

```javascript
const request = require("supertest");
const app = require("../app");
const db = require("../database");

describe("POST /api/produtos", () => {
  beforeEach(async () => {
    // Limpar banco antes de cada teste
    await db.query("DELETE FROM produtos");
  });

  it("deveria criar produto com dados válidos", async () => {
    const response = await request(app)
      .post("/api/produtos")
      .set("Authorization", "Bearer token123")
      .send({
        nome: "Skol 600ml",
        categoria: "Cerveja",
        precoCompra: 3.5,
        precoVenda: 5.5,
        quantidade: 100,
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.id).toBeDefined();
  });

  it("deveria rejeitar produto com nome muito curto", async () => {
    const response = await request(app)
      .post("/api/produtos")
      .set("Authorization", "Bearer token123")
      .send({
        nome: "ab", // Muito curto
        precoVenda: 5.5,
      });

    expect(response.status).toBe(400);
    expect(response.body.errors.nome).toBeDefined();
  });

  it("deveria rejeitar produto com preço inválido", async () => {
    const response = await request(app)
      .post("/api/produtos")
      .set("Authorization", "Bearer token123")
      .send({
        nome: "Skol 600ml",
        precoVenda: -5, // Negativo
      });

    expect(response.status).toBe(400);
    expect(response.body.errors.precoVenda).toBeDefined();
  });

  it("deveria sanitizar HTML", async () => {
    const response = await request(app)
      .post("/api/produtos")
      .set("Authorization", "Bearer token123")
      .send({
        nome: "Cerveja <script>alert('xss')</script>",
        precoVenda: 5.5,
      });

    // Verificar se foi sanitizado no banco
    const produto = await db.query("SELECT nome FROM produtos WHERE id = ?", [
      response.body.data.id,
    ]);

    expect(produto.nome).not.toContain("<script>");
  });

  it("deveria rejeitar sem autenticação", async () => {
    const response = await request(app).post("/api/produtos").send({
      nome: "Skol",
      precoVenda: 5.5,
    });

    expect(response.status).toBe(401);
  });

  it("deveria retornar erros estruturados", async () => {
    const response = await request(app)
      .post("/api/produtos")
      .set("Authorization", "Bearer token123")
      .send({
        nome: "a", // Curto
        precoVenda: -5, // Negativo
      });

    expect(response.body.success).toBe(false);
    expect(response.body.errors).toEqual({
      nome: expect.any(String),
      precoVenda: expect.any(String),
    });
  });
});
```

### Rodar Testes Backend

```bash
npm run test:backend

# Output:
# PASS  tests/api.produtos.test.js (1.234s)
#   POST /api/produtos
#     ✓ deveria criar produto com dados válidos (45ms)
#     ✓ deveria rejeitar produto com nome muito curto (23ms)
#     ✓ deveria rejeitar produto com preço inválido (19ms)
#     ✓ deveria sanitizar HTML (34ms)
#     ✓ deveria rejeitar sem autenticação (12ms)
#     ✓ deveria retornar erros estruturados (28ms)
```

---

## 4️⃣ Testes E2E - Frontend + Backend

### Com Cypress

```bash
npm install --save-dev cypress
npx cypress open
```

### Arquivo: `cypress/e2e/criar-produto.cy.js`

```javascript
describe("Criar Produto - Frontend + Backend", () => {
  beforeEach(() => {
    cy.visit("http://localhost:5173/produtos");
    cy.login("usuario@teste.com", "senha123");
  });

  it("deveria criar produto com sucesso", () => {
    // Clique no botão de criar
    cy.contains("Novo Produto").click();

    // Preencha o formulário
    cy.get('input[name="nome"]').type("Skol 600ml");
    cy.get('input[name="precoVenda"]').type("5.50");
    cy.get('select[name="categoria"]').select("Cerveja");

    // Importante: Validação em tempo real deve estar funcionando
    cy.get('input[name="nome"]').parent().should("not.have.class", "error");

    // Enviar
    cy.contains("Salvar").click();

    // Verificar sucesso
    cy.contains("Produto criado com sucesso").should("be.visible");
    cy.url().should("include", "/produtos");
  });

  it("deveria mostrar erro se nome muito curto", () => {
    cy.contains("Novo Produto").click();

    // Digite nome muito curto
    cy.get('input[name="nome"]').type("ab").blur(); // Trigger blur validation

    // Erro deve aparecer
    cy.contains("mínimo 3 caracteres").should("be.visible");

    // Botão deve estar desabilitado
    cy.contains("Salvar").should("be.disabled");
  });

  it("deveria mostrar erro do servidor", () => {
    // Intercept requisição
    cy.intercept("POST", "/api/produtos", {
      statusCode: 400,
      body: {
        success: false,
        errors: {
          nome: "Produto já existe",
        },
      },
    });

    cy.contains("Novo Produto").click();
    cy.get('input[name="nome"]').type("Skol 600ml");
    cy.get('input[name="precoVenda"]').type("5.50");

    cy.contains("Salvar").click();

    // Erro do servidor deve ser mostrado
    cy.contains("Produto já existe").should("be.visible");
    cy.get('input[name="nome"]').parent().should("have.class", "error");
  });

  it("deveria sanitizar input", () => {
    cy.contains("Novo Produto").click();

    // Tente inserir HTML (será sanitizado)
    cy.get('input[name="nome"]').type("Cerveja <script>alert('xss')</script>");

    cy.get('input[name="precoVenda"]').type("5.50");
    cy.contains("Salvar").click();

    // Verificar no servidor que foi sanitizado
    cy.contains("Produto criado com sucesso").should("be.visible");

    // Voltar à lista
    cy.visit("http://localhost:5173/produtos");

    // HTML não deve aparecer
    cy.contains("<script>").should("not.exist");
  });

  it("deveria validar de forma consistente", () => {
    cy.contains("Novo Produto").click();

    // Testa casos limite
    const testCases = [
      { nome: "ab", valid: false, error: "mínimo" },
      { nome: "Válido", valid: true, error: null },
      { nome: "a".repeat(101), valid: false, error: "máximo" },
    ];

    testCases.forEach(({ nome, valid, error }) => {
      cy.get('input[name="nome"]').clear().type(nome);

      if (error) {
        cy.contains(error).should("be.visible");
      }

      cy.contains("Salvar").should(valid ? "not.be.disabled" : "be.disabled");
    });
  });
});
```

### Rodar Testes E2E

```bash
npm run test:e2e

# Ou com interface gráfica
npx cypress open
```

---

## 📊 Cobertura de Testes

### Geração de Relatório

```bash
npm run test -- --coverage

# Output:
# ---------------------- Coverage summary ----------------------
# Statements   : 89.5% ( 456/510 )
# Branches     : 82.3% ( 234/284 )
# Functions    : 91.2% ( 234/256 )
# Lines        : 89.8% ( 456/507 )
```

### Target de Cobertura

```javascript
// package.json
{
  "jest": {
    "collectCoverageFrom": [
      "src/**/*.{js,jsx,ts,tsx}",
      "!src/main.jsx",
      "!src/vite-env.d.ts"
    ],
    "coverageThreshold": {
      "global": {
        "branches": 80,
        "functions": 80,
        "lines": 80,
        "statements": 80
      }
    }
  }
}
```

---

## 🔒 Testes de Segurança

### Teste: XSS Prevention

```javascript
describe("Segurança - XSS", () => {
  it("deveria prevenir <script> tags", () => {
    const input = "<script>alert('xss')</script>";
    const result = sanitizeInput(input);
    expect(result).not.toContain("<script>");
  });

  it("deveria prevenir event listeners", () => {
    const input = '<img src="x" onerror="alert()">';
    const result = sanitizeInput(input);
    expect(result).not.toContain("onerror");
  });

  it("deveria prevenir javascript protocol", () => {
    const input = '<a href="javascript:void(0)">link</a>';
    const result = sanitizeInput(input);
    expect(result).not.toContain("javascript:");
  });
});
```

### Teste: SQL Injection

```javascript
describe("Segurança - SQL Injection", () => {
  it("deveria prevenir SQL injection em nome", async () => {
    const malicious = "'; DROP TABLE produtos; --";

    const response = await request(app)
      .post("/api/produtos")
      .send({ nome: malicious });

    // Deve falhar na validação, não no banco
    expect(response.status).toBe(400);

    // Tabela deve existir ainda
    const check = await db.query("SELECT COUNT(*) FROM produtos");
    expect(check).toBeDefined();
  });
});
```

### Teste: Rate Limiting

```javascript
describe("Rate Limiting", () => {
  it("deveria bloquear múltiplas requisições", async () => {
    // Fazer 11 requisições
    for (let i = 0; i < 11; i++) {
      const response = await request(app)
        .post("/api/produtos")
        .send({ ...validData });

      if (i < 10) {
        expect(response.status).toBe(200); // OK
      } else {
        expect(response.status).toBe(429); // Too Many Requests
      }
    }
  });
});
```

---

## 🚀 CI/CD

### GitHub Actions

Arquivo: `.github/workflows/tests.yml`

```yaml
name: Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: 18

      - run: npm ci

      - name: Testes Unitários
        run: npm run test

      - name: Testes E2E
        run: npm run test:e2e

      - name: Cobertura
        run: npm run test:coverage

      - name: Upload Coverage
        uses: codecov/codecov-action@v3
```

### Rodar Tudo

```bash
npm run test:all

# Executa em ordem:
# 1. Testes unitários
# 2. Testes integração frontend
# 3. Testes integração backend
# 4. Testes E2E
# 5. Gera relatório de cobertura
```

---

## ✅ Checklist de Testes

- [ ] Validadores isolados (unitário)
- [ ] Hook com validadores (integração)
- [ ] Componentes com erros (integração)
- [ ] API com validação (integração backend)
- [ ] Sanitização funciona (segurança)
- [ ] Erros do servidor mostrados (E2E)
- [ ] Rate limiting está ativo
- [ ] Cobertura > 80%
- [ ] CI/CD passa
- [ ] Testes correm em < 5 minutos

---

## 📚 Resumo

| Tipo          | Speeds | Cobertura      | Tool             |
| ------------- | ------ | -------------- | ---------------- |
| Unitário      | ⚡⚡⚡ | 1 função       | Vitest           |
| Integração FE | ⚡⚡   | 1 componente   | Vitest + RTL     |
| Integração BE | ⚡⚡   | 1 endpoint     | Jest + Supertest |
| E2E           | ⚡     | Fluxo completo | Cypress          |

---

**Última atualização:** 23 de fevereiro de 2026
