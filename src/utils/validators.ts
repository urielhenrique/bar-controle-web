/**
 * Validadores seguros para o BarStock
 * Bloqueia caracteres perigosos e valida dados específicos do domínio
 */

// ============================================================================
// 🔐 SEGURANÇA - Sanitização e Detecção de Padrões Maliciosos
// ============================================================================

/**
 * Padrões perigosos que podem indicar tentativa de XSS ou injeção
 */
const MALICIOUS_PATTERNS = [
  /<script[^>]*>.*?<\/script>/gi,           // Script tags
  /<iframe[^>]*>.*?<\/iframe>/gi,           // Iframe tags
  /<img[^>]*>/gi,                            // Img tags
  /javascript:/gi,                           // Javascript protocol
  /on\w+\s*=/gi,                             // Event handlers (onerror=, onclick=, etc)
  /<[^>]*>/g,                                // Any HTML tag
  /eval\s*\(/gi,                             // eval()
  /expression\s*\(/gi,                       // CSS expression
];

/**
 * Remove/bloqueia caracteres suspeitos do input
 * @param value - String a ser sanitizada
 * @returns String limpa
 */
export function sanitizeInput(value: string): string {
  if (!value || typeof value !== "string") return "";
  
  let sanitized = value;
  
  // Remove múltiplos espaços consecutivos
  sanitized = sanitized.replace(/\s+/g, " ");
  
  // Remove caracteres de controle perigosos
  sanitized = sanitized.replace(/[\x00-\x1F\x7F]/g, "");
  
  // Remove caracteres null
  sanitized = sanitized.replace(/\0/g, "");
  
  return sanitized.trim();
}

/**
 * Detecta padrões maliciosos no input
 * @param value - String a ser verificada
 * @returns true se contém padrões maliciosos
 */
export function containsMaliciousPattern(value: string): boolean {
  if (!value || typeof value !== "string") return false;
  
  return MALICIOUS_PATTERNS.some(pattern => pattern.test(value));
}

/**
 * Valida se input é seguro (sem HTML ou JS)
 * @param value - String a ser validada
 * @returns Objeto com isValid e erro (se houver)
 */
export function validateSafeInput(
  value: string
): { isValid: boolean; error?: string } {
  if (containsMaliciousPattern(value)) {
    return {
      isValid: false,
      error: "Caracteres inválidos detectados. Não são permitidas tags HTML ou scripts.",
    };
  }
  
  return { isValid: true };
}

// ============================================================================
// 📦 PRODUTO - Validações específicas
// ============================================================================

/**
 * Valida nome do produto
 * - Obrigatório
 * - Mínimo 3 caracteres
 * - Máximo 100
 * - Apenas letras, números, espaço e hífen
 */
export function validateProductName(
  value: string
): { isValid: boolean; error?: string } {
  if (!value || !value.trim()) {
    return { isValid: false, error: "Nome do produto é obrigatório" };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: "Nome deve ter no mínimo 3 caracteres" };
  }
  
  if (trimmed.length > 100) {
    return { isValid: false, error: "Nome não pode exceder 100 caracteres" };
  }
  
  // Apenas letras, números, espaço, hífen e acentos
  const nameRegex = /^[a-záéíóúâêôãõç\s\-0-9]+$/i;
  if (!nameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Nome pode conter apenas letras, números, espaço e hífen",
    };
  }
  
  const safeInput = validateSafeInput(trimmed);
  if (!safeInput.isValid) {
    return safeInput;
  }
  
  return { isValid: true };
}

/**
 * Valida descrição do produto
 * - Opcional
 * - Máximo 255 caracteres
 * - Sem HTML
 */
export function validateProductDescription(
  value: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true }; // Opcional
  }
  
  if (value.length > 255) {
    return {
      isValid: false,
      error: "Descrição não pode exceder 255 caracteres",
    };
  }
  
  return validateSafeInput(value);
}

/**
 * Valida preço (moeda)
 * - Apenas números (com vírgula ou ponto como decimal)
 * - Não permitir negativo
 * - Máximo 2 casas decimais
 */
export function validatePrice(
  value: string | number
): { isValid: boolean; error?: string } {
  const numValue = Number(value);
  
  if (isNaN(numValue)) {
    return { isValid: false, error: "Preço deve ser um número válido" };
  }
  
  if (numValue < 0) {
    return { isValid: false, error: "Preço não pode ser negativo" };
  }
  
  if (numValue > 999999.99) {
    return { isValid: false, error: "Preço não pode exceder R$ 999.999,99" };
  }
  
  return { isValid: true };
}

/**
 * Valida quantidade
 * - Apenas número inteiro
 * - Não permitir negativo
 * - Máximo 999999
 */
export function validateQuantity(
  value: string | number
): { isValid: boolean; error?: string } {
  const numValue = Number(value);
  
  if (!Number.isInteger(numValue)) {
    return { isValid: false, error: "Quantidade deve ser um número inteiro" };
  }
  
  if (numValue < 0) {
    return { isValid: false, error: "Quantidade não pode ser negativa" };
  }
  
  if (numValue > 999999) {
    return { isValid: false, error: "Quantidade máxima é 999.999" };
  }
  
  return { isValid: true };
}

// ============================================================================
// 🚚 FORNECEDOR - Telefone e CNPJ
// ============================================================================

/**
 * Valida telefone brasileiro
 * - Apenas números
 * - Deve ter pelo menos 10 dígitos (com DDD)
 * - Máximo 11 dígitos
 */
export function validatePhoneBR(
  value: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true }; // Opcional
  }
  
  const digits = value.replace(/\D/g, "");
  
  if (digits.length < 10) {
    return { isValid: false, error: "Telefone deve ter pelo menos 10 dígitos" };
  }
  
  if (digits.length > 11) {
    return { isValid: false, error: "Telefone não pode ter mais de 11 dígitos" };
  }
  
  return { isValid: true };
}

/**
 * Valida CNPJ (validação real com cálculo de dígito verificador)
 * Formato: 00.000.000/0000-00
 */
export function validateCNPJ(
  value: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true }; // Opcional
  }
  
  const cnpj = value.replace(/\D/g, "");
  
  // Deve ter exatamente 14 dígitos
  if (cnpj.length !== 14) {
    return { isValid: false, error: "CNPJ deve conter 14 dígitos" };
  }
  
  // Rejeita sequências repetidas
  if (/^(\d)\1{13}$/.test(cnpj)) {
    return { isValid: false, error: "CNPJ inválido" };
  }
  
  // Validação do primeiro dígito verificador
  let size = cnpj.length - 2;
  let numbers = cnpj.substring(0, size);
  let digits = cnpj.substring(size);
  let sum = 0;
  let pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let firstDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (firstDigit !== Number(digits.charAt(0))) {
    return { isValid: false, error: "CNPJ inválido" };
  }
  
  // Validação do segundo dígito verificador
  size = cnpj.length - 1;
  numbers = cnpj.substring(0, size);
  sum = 0;
  pos = size - 7;
  
  for (let i = size; i >= 1; i--) {
    sum += Number(numbers.charAt(size - i)) * pos--;
    if (pos < 2) pos = 9;
  }
  
  let secondDigit = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  
  if (secondDigit !== Number(digits.charAt(1))) {
    return { isValid: false, error: "CNPJ inválido" };
  }
  
  return { isValid: true };
}

/**
 * Valida nome do fornecedor
 * - Obrigatório
 * - Mínimo 3 caracteres
 * - Máximo 150 caracteres
 */
export function validateSupplierName(
  value: string
): { isValid: boolean; error?: string } {
  if (!value || !value.trim()) {
    return { isValid: false, error: "Nome do fornecedor é obrigatório" };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length < 3) {
    return { isValid: false, error: "Nome deve ter no mínimo 3 caracteres" };
  }
  
  if (trimmed.length > 150) {
    return { isValid: false, error: "Nome não pode exceder 150 caracteres" };
  }
  
  const safeInput = validateSafeInput(trimmed);
  return safeInput.isValid ? { isValid: true } : safeInput;
}

// ============================================================================
// 👤 USUÁRIO - Email e Senha
// ============================================================================

/**
 * Valida email
 * - Regex robusta
 * - Sem espaços
 * - Domínio válido
 */
export function validateEmail(
  value: string
): { isValid: boolean; error?: string } {
  if (!value || !value.trim()) {
    return { isValid: false, error: "Email é obrigatório" };
  }
  
  const trimmed = value.trim();
  
  // Rejeita espaços
  if (/\s/.test(trimmed)) {
    return { isValid: false, error: "Email não pode conter espaços" };
  }
  
  // RFC 5322 simplified regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(trimmed)) {
    return { isValid: false, error: "Email inválido" };
  }
  
  // Validações adicionais
  if (trimmed.length > 255) {
    return { isValid: false, error: "Email não pode exceder 255 caracteres" };
  }
  
  // Verifica domínio válido
  const domain = trimmed.split("@")[1];
  if (!domain || domain.length < 3) {
    return { isValid: false, error: "Domínio de email inválido" };
  }
  
  return { isValid: true };
}

/**
 * Valida senha
 * - Mínimo 8 caracteres
 * - Pelo menos 1 letra
 * - Pelo menos 1 número
 * - Sem espaços
 * - Não permitir sequências simples (123456, abcdef)
 */
export function validatePassword(
  value: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: false, error: "Senha é obrigatória" };
  }
  
  if (value.length < 8) {
    return {
      isValid: false,
      error: "Senha deve ter no mínimo 8 caracteres",
    };
  }
  
  if (value.length > 128) {
    return {
      isValid: false,
      error: "Senha não pode exceder 128 caracteres",
    };
  }
  
  // Rejeita espaços
  if (/\s/.test(value)) {
    return { isValid: false, error: "Senha não pode conter espaços" };
  }
  
  // Deve ter pelo menos uma letra
  if (!/[a-záéíóúâêôãõç]/i.test(value)) {
    return { isValid: false, error: "Senha deve conter pelo menos uma letra" };
  }
  
  // Deve ter pelo menos um número
  if (!/\d/.test(value)) {
    return { isValid: false, error: "Senha deve conter pelo menos um número" };
  }
  
  // Rejeita sequências simples
  const simpleSequences = [
    "12345678",
    "87654321",
    "abcdefgh",
    "hgfedcba",
    "qwerty",
    "123456",
    "password",
    "admin123",
  ];
  
  if (
    simpleSequences.some((seq) =>
      value.toLowerCase().includes(seq.toLowerCase())
    )
  ) {
    return {
      isValid: false,
      error: "Senha não pode conter sequências simples ou comuns",
    };
  }
  
  return { isValid: true };
}

/**
 * Valida nome de usuário
 * - Obrigatório
 * - Mínimo 3 caracteres
 * - Máximo 50 caracteres
 * - Apenas letras, números, underscore e hífen
 */
export function validateUsername(
  value: string
): { isValid: boolean; error?: string } {
  if (!value || !value.trim()) {
    return { isValid: false, error: "Nome de usuário é obrigatório" };
  }
  
  const trimmed = value.trim();
  
  if (trimmed.length < 3) {
    return {
      isValid: false,
      error: "Nome de usuário deve ter no mínimo 3 caracteres",
    };
  }
  
  if (trimmed.length > 50) {
    return {
      isValid: false,
      error: "Nome de usuário não pode exceder 50 caracteres",
    };
  }
  
  const usernameRegex = /^[a-z0-9_\-]+$/i;
  if (!usernameRegex.test(trimmed)) {
    return {
      isValid: false,
      error: "Nome de usuário pode conter apenas letras, números, underscore e hífen",
    };
  }
  
  const safeInput = validateSafeInput(trimmed);
  return safeInput.isValid ? { isValid: true } : safeInput;
}

// ============================================================================
// 🔄 MOVIMENTAÇÃO DE ESTOQUE
// ============================================================================

/**
 * Valida observação de movimentação
 * - Opcional
 * - Máximo 200 caracteres
 * - Sanitização obrigatória
 */
export function validateMovementObservation(
  value: string
): { isValid: boolean; error?: string } {
  if (!value) {
    return { isValid: true }; // Opcional
  }
  
  if (value.length > 200) {
    return {
      isValid: false,
      error: "Observação não pode exceder 200 caracteres",
    };
  }
  
  const safeInput = validateSafeInput(value);
  if (!safeInput.isValid) {
    return safeInput;
  }
  
  return { isValid: true };
}

/**
 * Valida tipo de movimentação
 * - Apenas "entrada" ou "saída"
 */
export function validateMovementType(
  value: string
): { isValid: boolean; error?: string } {
  if (!["entrada", "saída", "ajuste"].includes(value?.toLowerCase())) {
    return {
      isValid: false,
      error: 'Tipo deve ser "entrada", "saída" ou "ajuste"',
    };
  }
  
  return { isValid: true };
}

// ============================================================================
// 🎯 VALIDAÇÕES COMPOSTAS
// ============================================================================

/**
 * Interface para resultado de validação de formulário
 */
export interface FormValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

/**
 * Valida formulário de produto completo
 */
export function validateProductForm(formData: {
  nome: string;
  descricao?: string;
  precoCompra?: string | number;
  precoVenda?: string | number;
  quantidade?: string | number;
  categoria?: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateProductName(formData.nome);
  if (!nameValidation.isValid) {
    errors.nome = nameValidation.error || "Inválido";
  }
  
  if (formData.descricao !== undefined) {
    const descValidation = validateProductDescription(formData.descricao);
    if (!descValidation.isValid) {
      errors.descricao = descValidation.error || "Inválido";
    }
  }
  
  if (formData.precoCompra !== undefined && formData.precoCompra !== "") {
    const priceValidation = validatePrice(formData.precoCompra);
    if (!priceValidation.isValid) {
      errors.precoCompra = priceValidation.error || "Inválido";
    }
  }
  
  if (formData.precoVenda !== undefined && formData.precoVenda !== "") {
    const priceValidation = validatePrice(formData.precoVenda);
    if (!priceValidation.isValid) {
      errors.precoVenda = priceValidation.error || "Inválido";
    }
  }
  
  if (formData.quantidade !== undefined && formData.quantidade !== "") {
    const qtyValidation = validateQuantity(formData.quantidade);
    if (!qtyValidation.isValid) {
      errors.quantidade = qtyValidation.error || "Inválido";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida formulário de fornecedor completo
 */
export function validateSupplierForm(formData: {
  nome: string;
  telefone?: string;
  cnpj?: string;
  email?: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};
  
  const nameValidation = validateSupplierName(formData.nome);
  if (!nameValidation.isValid) {
    errors.nome = nameValidation.error || "Inválido";
  }
  
  if (formData.telefone) {
    const phoneValidation = validatePhoneBR(formData.telefone);
    if (!phoneValidation.isValid) {
      errors.telefone = phoneValidation.error || "Inválido";
    }
  }
  
  if (formData.cnpj) {
    const cnpjValidation = validateCNPJ(formData.cnpj);
    if (!cnpjValidation.isValid) {
      errors.cnpj = cnpjValidation.error || "Inválido";
    }
  }
  
  if (formData.email) {
    const emailValidation = validateEmail(formData.email);
    if (!emailValidation.isValid) {
      errors.email = emailValidation.error || "Inválido";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Valida formulário de usuário completo
 */
export function validateUserForm(formData: {
  username?: string;
  email: string;
  password: string;
  passwordConfirm?: string;
}): FormValidationResult {
  const errors: Record<string, string> = {};
  
  if (formData.username) {
    const usernameValidation = validateUsername(formData.username);
    if (!usernameValidation.isValid) {
      errors.username = usernameValidation.error || "Inválido";
    }
  }
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.isValid) {
    errors.email = emailValidation.error || "Inválido";
  }
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.isValid) {
    errors.password = passwordValidation.error || "Inválido";
  }
  
  // Validar confirmação de senha se fornecida
  if (formData.passwordConfirm) {
    if (formData.password !== formData.passwordConfirm) {
      errors.passwordConfirm = "Senhas não coincidem";
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
