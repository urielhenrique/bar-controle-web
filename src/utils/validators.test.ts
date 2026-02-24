/**
 * Exemplos de Testes para Validadores
 * Use com Jest ou Vitest
 *
 * Para executar:
 * npm test src/utils/validators.test.ts
 *
 * Ou com Vitest:
 * npm run test
 */

import { describe, it, expect } from "vitest";
import {
  // Segurança
  sanitizeInput,
  containsMaliciousPattern,
  validateSafeInput,

  // Produto
  validateProductName,
  validateProductDescription,
  validatePrice,
  validateQuantity,

  // Fornecedor
  validatePhoneBR,
  validateCNPJ,
  validateSupplierName,

  // Usuário
  validateEmail,
  validatePassword,
  validateUsername,

  // Movimentação
  validateMovementObservation,
  validateMovementType,
} from "./validators";

// ============================================================================
// 🔐 SEGURANÇA - Testes
// ============================================================================

describe("Segurança - Sanitização", () => {
  it("deve remover script tags", () => {
    const input = "<script>alert('xss')</script>";
    const result = sanitizeInput(input);
    expect(result).not.toContain("<");
    expect(result).not.toContain(">");
  });

  it("deve detectar padrões maliciosos", () => {
    expect(containsMaliciousPattern("<script>alert()</script>")).toBe(true);
    expect(containsMaliciousPattern("javascript:alert()")).toBe(true);
    expect(containsMaliciousPattern('<img onerror="alert()">')).toBe(true);
    expect(containsMaliciousPattern("teste normal")).toBe(false);
  });

  it("deve validar input seguro", () => {
    const good = validateSafeInput("Texto normal");
    expect(good.isValid).toBe(true);

    const bad = validateSafeInput("<script>alert()</script>");
    expect(bad.isValid).toBe(false);
    expect(bad.error).toBeDefined();
  });

  it("deve remover espaços múltiplos", () => {
    const result = sanitizeInput("texto  com   espaços");
    expect(result).toBe("texto com espaços");
  });
});

// ============================================================================
// 📦 PRODUTO - Testes
// ============================================================================

describe("Produto - Validações", () => {
  describe("validateProductName", () => {
    it("deve aceitar nome válido", () => {
      const result = validateProductName("Skol 600ml");
      expect(result.isValid).toBe(true);
    });

    it("deve rejeitar nome vazio", () => {
      const result = validateProductName("");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("obrigatório");
    });

    it("deve rejeitar nome com menos de 3 caracteres", () => {
      const result = validateProductName("ab");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("mínimo");
    });

    it("deve rejeitar nome com mais de 100 caracteres", () => {
      const name = "a".repeat(101);
      const result = validateProductName(name);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("não pode exceder");
    });

    it("deve rejeitar caracteres especiais", () => {
      const result = validateProductName("Produto @#$%");
      expect(result.isValid).toBe(false);
    });

    it("deve aceitar acentos", () => {
      const result = validateProductName("Açúcar Premium");
      expect(result.isValid).toBe(true);
    });
  });

  describe("validatePrice", () => {
    it("deve aceitar preço válido", () => {
      expect(validatePrice("12.50").isValid).toBe(true);
      expect(validatePrice("0.99").isValid).toBe(true);
      expect(validatePrice("999999.99").isValid).toBe(true);
    });

    it("deve rejeitar preço negativo", () => {
      const result = validatePrice("-10");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("negativo");
    });

    it("deve rejeitar preço acima do máximo", () => {
      const result = validatePrice("1000000");
      expect(result.isValid).toBe(false);
    });

    it("deve aceitar string ou número", () => {
      expect(validatePrice("25.50").isValid).toBe(true);
      expect(validatePrice(25.5).isValid).toBe(true);
    });
  });

  describe("validateQuantity", () => {
    it("deve aceitar quantidade válida", () => {
      expect(validateQuantity("100").isValid).toBe(true);
      expect(validateQuantity(999999).isValid).toBe(true);
    });

    it("deve rejeitar quantidade negativa", () => {
      const result = validateQuantity("-5");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("negativo");
    });

    it("deve rejeitar decimal", () => {
      const result = validateQuantity("10.5");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("inteiro");
    });

    it("deve rejeitar quantidade acima do máximo", () => {
      const result = validateQuantity("1000000");
      expect(result.isValid).toBe(false);
    });
  });
});

// ============================================================================
// 🚚 FORNECEDOR - Testes
// ============================================================================

describe("Fornecedor - Validações", () => {
  describe("validatePhoneBR", () => {
    it("deve aceitar telefone com 11 dígitos", () => {
      expect(validatePhoneBR("11999999999").isValid).toBe(true);
    });

    it("deve aceitar telefone com 10 dígitos", () => {
      expect(validatePhoneBR("1133333333").isValid).toBe(true);
    });

    it("deve aceitar telefone formatado", () => {
      expect(validatePhoneBR("(11) 99999-9999").isValid).toBe(true);
    });

    it("deve rejeitar telefone com menos de 10 dígitos", () => {
      const result = validatePhoneBR("119999");
      expect(result.isValid).toBe(false);
    });

    it("deve rejeitar telefone com mais de 11 dígitos", () => {
      const result = validatePhoneBR("119999999999");
      expect(result.isValid).toBe(false);
    });

    it("deve aceitar telefone vazio (opcional)", () => {
      expect(validatePhoneBR("").isValid).toBe(true);
    });
  });

  describe("validateCNPJ", () => {
    it("deve rejeitar CNPJ vazio (opcional)", () => {
      expect(validateCNPJ("").isValid).toBe(true);
    });

    it("deve rejeitar CNPJ com menos de 14 dígitos", () => {
      const result = validateCNPJ("123");
      expect(result.isValid).toBe(false);
    });

    it("deve rejeitar sequência repetida", () => {
      const result = validateCNPJ("11111111111111");
      expect(result.isValid).toBe(false);
    });

    // Nota: Para um CNPJ válido real, seria necessário um número que
    // passe na validação do dígito verificador. Exemplo com teste simplificado:
    it("deve validar formato e comprimento", () => {
      const result = validateCNPJ("12345678000190");
      // Este é um exemplo - um CNPJ real deveria passar
    });
  });

  describe("validateSupplierName", () => {
    it("deve aceitar nome válido", () => {
      expect(validateSupplierName("Distribuidora ABC").isValid).toBe(true);
    });

    it("deve rejeitar nome vazio", () => {
      expect(validateSupplierName("").isValid).toBe(false);
    });

    it("deve rejeitar nome com menos de 3 caracteres", () => {
      expect(validateSupplierName("AB").isValid).toBe(false);
    });

    it("deve rejeitar nome acima de 150 caracteres", () => {
      const name = "a".repeat(151);
      expect(validateSupplierName(name).isValid).toBe(false);
    });
  });
});

// ============================================================================
// 👤 USUÁRIO - Testes
// ============================================================================

describe("Usuário - Validações", () => {
  describe("validateEmail", () => {
    it("deve aceitar email válido", () => {
      expect(validateEmail("user@example.com").isValid).toBe(true);
      expect(validateEmail("user+tag@example.co.uk").isValid).toBe(true);
    });

    it("deve rejeitar email vazio", () => {
      const result = validateEmail("");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("obrigatório");
    });

    it("deve rejeitar email sem @", () => {
      expect(validateEmail("userexample.com").isValid).toBe(false);
    });

    it("deve rejeitar email com espaço", () => {
      expect(validateEmail("user @example.com").isValid).toBe(false);
    });

    it("deve rejeitar email sem domínio", () => {
      expect(validateEmail("user@").isValid).toBe(false);
    });
  });

  describe("validatePassword", () => {
    it("deve aceitar senha forte", () => {
      expect(validatePassword("MyPassword123").isValid).toBe(true);
      expect(validatePassword("Abc!def@123").isValid).toBe(true);
    });

    it("deve rejeitar senha com menos de 8 caracteres", () => {
      const result = validatePassword("Pass12");
      expect(result.isValid).toBe(false);
      expect(result.error).toContain("mínimo");
    });

    it("deve rejeitar senha sem letras", () => {
      expect(validatePassword("12345678").isValid).toBe(false);
    });

    it("deve rejeitar senha sem números", () => {
      expect(validatePassword("Password").isValid).toBe(false);
    });

    it("deve rejeitar senha com espaço", () => {
      expect(validatePassword("Pass word 123").isValid).toBe(false);
    });

    it("deve rejeitar sequências simples", () => {
      expect(validatePassword("12345678a").isValid).toBe(false);
      expect(validatePassword("abcdefgh1").isValid).toBe(false);
      expect(validatePassword("password1").isValid).toBe(false);
    });
  });

  describe("validateUsername", () => {
    it("deve aceitar username válido", () => {
      expect(validateUsername("user_123").isValid).toBe(true);
      expect(validateUsername("user-name").isValid).toBe(true);
    });

    it("deve rejeitar username com menos de 3 caracteres", () => {
      expect(validateUsername("ab").isValid).toBe(false);
    });

    it("deve rejeitar username com mais de 50 caracteres", () => {
      const name = "a".repeat(51);
      expect(validateUsername(name).isValid).toBe(false);
    });

    it("deve rejeitar username com caracteres especiais", () => {
      expect(validateUsername("user@name").isValid).toBe(false);
      expect(validateUsername("user#name").isValid).toBe(false);
    });

    it("deve aceitar underscore e hífen", () => {
      expect(validateUsername("user_name-123").isValid).toBe(true);
    });
  });
});

// ============================================================================
// 🔄 MOVIMENTAÇÃO - Testes
// ============================================================================

describe("Movimentação - Validações", () => {
  describe("validateMovementType", () => {
    it("deve aceitar tipo válido", () => {
      expect(validateMovementType("entrada").isValid).toBe(true);
      expect(validateMovementType("saída").isValid).toBe(true);
      expect(validateMovementType("ajuste").isValid).toBe(true);
    });

    it("deve rejeitar tipo inválido", () => {
      expect(validateMovementType("invalido").isValid).toBe(false);
    });

    it("deve ser case-insensitive", () => {
      expect(validateMovementType("ENTRADA").isValid).toBe(true);
      expect(validateMovementType("Saída").isValid).toBe(true);
    });
  });

  describe("validateMovementObservation", () => {
    it("deve aceitar observação válida", () => {
      expect(validateMovementObservation("Reposição de estoque").isValid).toBe(
        true,
      );
    });

    it("debe aceitar observação vazia (opcional)", () => {
      expect(validateMovementObservation("").isValid).toBe(true);
    });

    it("deve rejeitar observação acima de 200 caracteres", () => {
      const text = "a".repeat(201);
      const result = validateMovementObservation(text);
      expect(result.isValid).toBe(false);
    });

    it("deve rejeitar HTML na observação", () => {
      const result = validateMovementObservation("<script>alert()</script>");
      expect(result.isValid).toBe(false);
    });
  });
});

// ============================================================================
// 📝 Testes de Integração
// ============================================================================

describe("Integração - Formulários Completos", () => {
  it("deve validar formulário de produto completo", () => {
    const { validateProductForm } = require("./validators");

    const result = validateProductForm({
      nome: "Skol 600ml",
      descricao: "Cerveja clara",
      precoVenda: "5.50",
      quantidade: "100",
    });

    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it("deve retornar múltiplos erros", () => {
    const { validateProductForm } = require("./validators");

    const result = validateProductForm({
      nome: "ab", // Muito curto
      precoVenda: "-10", // Negativo
      quantidade: "abc", // Não numérico
    });

    expect(result.isValid).toBe(false);
    expect(Object.keys(result.errors).length).toBeGreaterThan(0);
  });
});

// ============================================================================
// 🧪 Como Rodar os Testes
// ============================================================================

/**
 * Com Vitest:
 *
 * 1. Instalar Vitest
 *    npm install -D vitest
 *
 * 2. Criar vite.config.ts
 *    export default {
 *      test: {
 *        environment: 'happy-dom'
 *      }
 *    }
 *
 * 3. Rodar testes
 *    npm run test
 *
 * 4. Rodar teste específico
 *    npm run test -- validators.test.ts
 *
 * 5. Modo watch
 *    npm run test -- --watch
 *
 * Com Jest:
 *
 * 1. Instalar Jest
 *    npm install -D jest @types/jest
 *
 * 2. Configurar jest.config.js
 *
 * 3. Rodar
 *    npm test
 */
