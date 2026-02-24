export function createPageUrl(pageName: string) {
  return "/" + pageName.replace(/ /g, "-");
}

// ============================================================================
// Validadores
// ============================================================================

// Segurança
export {
  sanitizeInput,
  containsMaliciousPattern,
  validateSafeInput,
} from "./validators";

// Produto
export {
  validateProductName,
  validateProductDescription,
  validatePrice,
  validateQuantity,
  validateProductForm,
} from "./validators";

// Fornecedor
export {
  validatePhoneBR,
  validateCNPJ,
  validateSupplierName,
  validateSupplierForm,
} from "./validators";

// Usuário
export {
  validateEmail,
  validatePassword,
  validateUsername,
  validateUserForm,
} from "./validators";

// Movimentação
export {
  validateMovementObservation,
  validateMovementType,
} from "./validators";

// ============================================================================
// Formatadores
// ============================================================================

// Moeda
export {
  formatCurrencyBR,
  parseCurrencyBR,
  formatCurrencyInput,
} from "./formatters";

// Telefone
export {
  formatPhoneBR,
  parsePhoneBR,
} from "./formatters";

// CNPJ
export {
  formatCNPJ,
  parseCNPJ,
} from "./formatters";

// Quantidade
export {
  formatQuantity,
  parseQuantity,
  formatQuantityInput,
} from "./formatters";

// Texto
export {
  truncateText,
  normalizeText,
} from "./formatters";

// Data
export {
  formatDateBR,
  formatDateTimeBR,
  formatTimeBR,
  formatRelativeTime,
} from "./formatters";

// CPF
export {
  formatCPF,
  parseCPF,
} from "./formatters";

// Utilitários
export {
  capitalize,
  toUpperCaseBR,
  toLowerCaseBR,
  removeAccents,
} from "./formatters";
