/**
 * Formatadores para o BarStock
 * Formata dados para exibição e entrada do usuário
 */

// ============================================================================
// 💰 MOEDA - Formatação Brasileira
// ============================================================================

/**
 * Formata número como moeda brasileira (R$)
 * @param value - String ou número a formatar
 * @returns Valor formatado como "R$ 1.234,56"
 */
export function formatCurrencyBR(value: string | number): string {
  if (!value && value !== 0) return "R$ 0,00";

  const numValue =
    typeof value === "string"
      ? parseFloat(value.replace(/\D/g, "") || "0") / 100
      : Number(value);

  if (isNaN(numValue)) return "R$ 0,00";

  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(numValue);
}

/**
 * Remove formatação de moeda e retorna número
 * @param value - Valor formatado
 * @returns Número parseado
 */
export function parseCurrencyBR(value: string): number {
  if (!value) return 0;

  // Remove "R$" e espaços
  const cleaned = value.replace(/R\$\s?/g, "").trim();

  // Converte formato brasileiro: replace "." (milhar) remove, replace "," (decimal) com "."
  const normalized = cleaned.replace(/\./g, "").replace(/,/g, ".");

  return parseFloat(normalized) || 0;
}

/**
 * Formata input de moeda em tempo real (permite digitação)
 * @param value - Valor digitado
 * @returns Valor formatado ou original se inválido
 */
export function formatCurrencyInput(value: string): string {
  if (!value) return "";

  // Remove tudo exceto números
  const digits = value.replace(/\D/g, "");

  if (!digits) return "";

  // Converte em número (considerando 2 casas decimais)
  const numValue = parseInt(digits, 10) / 100;

  return numValue.toLocaleString("pt-BR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

// ============================================================================
// 📞 TELEFONE - Máscara Brasileira
// ============================================================================

/**
 * Formata telefone brasileiro com máscara automática
 * Aceita: 1099999999 ou 11999999999
 * Retorna: (11) 99999-9999 ou (11) 9999-9999
 *
 * @param value - String com números
 * @returns Telefone formatado
 */
export function formatPhoneBR(value: string): string {
  if (!value) return "";

  // Remove tudo que não é número
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // Limita a 11 dígitos
  const limited = digits.substring(0, 11);

  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 7) {
    // (XX) XXXX
    return `(${limited.substring(0, 2)}) ${limited.substring(2)}`;
  } else {
    // (XX) XXXXX-XXXX ou (XX) XXXX-XXXX
    const areaCode = limited.substring(0, 2);
    const firstPart = limited.substring(2, limited.length - 4);
    const lastPart = limited.substring(limited.length - 4);
    return `(${areaCode}) ${firstPart}-${lastPart}`;
  }
}

/**
 * Remove formatação de telefone
 * @param value - Telefone formatado
 * @returns Apenas dígitos
 */
export function parsePhoneBR(value: string): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

// ============================================================================
// 🏢 CNPJ - Máscara e Validação
// ============================================================================

/**
 * Formata CNPJ com máscara automática
 * Entrada: 00000000000000
 * Saída: 00.000.000/0000-00
 *
 * @param value - String com dígitos
 * @returns CNPJ formatado
 */
export function formatCNPJ(value: string): string {
  if (!value) return "";

  // Remove tudo que não é número
  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // Limita a 14 dígitos
  const limited = digits.substring(0, 14);

  if (limited.length <= 2) {
    return limited;
  } else if (limited.length <= 5) {
    // XX.XXX
    return `${limited.substring(0, 2)}.${limited.substring(2)}`;
  } else if (limited.length <= 8) {
    // XX.XXX.XXX
    return `${limited.substring(0, 2)}.${limited.substring(2, 5)}.${limited.substring(5)}`;
  } else if (limited.length <= 12) {
    // XX.XXX.XXX/XXXX
    return `${limited.substring(0, 2)}.${limited.substring(2, 5)}.${limited.substring(5, 8)}/${limited.substring(8)}`;
  } else {
    // XX.XXX.XXX/XXXX-XX
    return `${limited.substring(0, 2)}.${limited.substring(2, 5)}.${limited.substring(5, 8)}/${limited.substring(8, 12)}-${limited.substring(12)}`;
  }
}

/**
 * Remove formatação de CNPJ
 * @param value - CNPJ formatado
 * @returns Apenas dígitos
 */
export function parseCNPJ(value: string): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

// ============================================================================
// 📋 QUANTIDADE - Formatação de Número Inteiro
// ============================================================================

/**
 * Formata quantidade com separador de milhar
 * @param value - Número ou string
 * @returns Quantidade formatada (ex: "1.234")
 */
export function formatQuantity(value: string | number): string {
  if (!value && value !== 0) return "0";

  const numValue =
    typeof value === "string"
      ? parseInt(value.replace(/\D/g, ""), 10)
      : Number(value);

  if (isNaN(numValue)) return "0";

  return numValue.toLocaleString("pt-BR");
}

/**
 * Remove formatação de quantidade
 * @param value - Quantidade formatada
 * @returns Número inteiro
 */
export function parseQuantity(value: string): number {
  if (!value) return 0;
  return parseInt(value.replace(/\D/g, ""), 10) || 0;
}

/**
 * Valida e formata input de quantidade em tempo real
 * @param value - Valor digitado
 * @returns Apenas dígitos (string)
 */
export function formatQuantityInput(value: string): string {
  if (!value) return "";

  // Remove tudo que não é número
  const digits = value.replace(/\D/g, "");

  // Limita a 6 dígitos (máximo 999999)
  return digits.substring(0, 6);
}

// ============================================================================
// 📝 TEXTO - Truncar e Limitar
// ============================================================================

/**
 * Trunca texto para determinado comprimento
 * @param text - Texto a truncar
 * @param maxLength - Comprimento máximo
 * @param suffix - Sufixo (padrão: "...")
 * @returns Texto truncado
 */
export function truncateText(
  text: string,
  maxLength: number,
  suffix: string = "...",
): string {
  if (!text || text.length <= maxLength) {
    return text || "";
  }

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove espaços extras e normaliza quebras de linha
 * @param text - Texto a normalizar
 * @returns Texto normalizado
 */
export function normalizeText(text: string): string {
  if (!text) return "";

  return text.trim().replace(/\s+/g, " ").replace(/\n\n+/g, "\n");
}

// ============================================================================
// 📊 DATA E HORA
// ============================================================================

/**
 * Formata data para formato brasileiro
 * @param date - Data (Date ou string ISO)
 * @returns "DD/MM/YYYY"
 */
export function formatDateBR(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toLocaleDateString("pt-BR");
}

/**
 * Formata data com hora
 * @param date - Data (Date ou string ISO)
 * @returns "DD/MM/YYYY HH:mm"
 */
export function formatDateTimeBR(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toLocaleDateString("pt-BR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata hora
 * @param date - Data (Date ou string ISO)
 * @returns "HH:mm"
 */
export function formatTimeBR(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  return dateObj.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Formata tempo relativo (ex: "há 2 minutos")
 * @param date - Data passada
 * @returns Texto relativo
 */
export function formatRelativeTime(date: Date | string): string {
  const dateObj = typeof date === "string" ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return "";
  }

  const now = new Date();
  const seconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);

  if (seconds < 60) {
    return "agora mesmo";
  }

  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) {
    return `há ${minutes} minuto${minutes > 1 ? "s" : ""}`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `há ${hours} hora${hours > 1 ? "s" : ""}`;
  }

  const days = Math.floor(hours / 24);
  if (days < 7) {
    return `há ${days} dia${days > 1 ? "s" : ""}`;
  }

  const weeks = Math.floor(days / 7);
  if (weeks < 4) {
    return `há ${weeks} semana${weeks > 1 ? "s" : ""}`;
  }

  return formatDateBR(dateObj);
}

// ============================================================================
// 🔢 CPF (Futura expansão)
// ============================================================================

/**
 * Formata CPF com máscara automática
 * Entrada: 12345678900
 * Saída: 123.456.789-00
 *
 * @param value - String com dígitos
 * @returns CPF formatado
 */
export function formatCPF(value: string): string {
  if (!value) return "";

  const digits = value.replace(/\D/g, "");

  if (digits.length === 0) return "";

  const limited = digits.substring(0, 11);

  if (limited.length <= 3) {
    return limited;
  } else if (limited.length <= 6) {
    // XXX.XXX
    return `${limited.substring(0, 3)}.${limited.substring(3)}`;
  } else if (limited.length <= 9) {
    // XXX.XXX.XXX
    return `${limited.substring(0, 3)}.${limited.substring(3, 6)}.${limited.substring(6)}`;
  } else {
    // XXX.XXX.XXX-XX
    return `${limited.substring(0, 3)}.${limited.substring(3, 6)}.${limited.substring(6, 9)}-${limited.substring(9)}`;
  }
}

/**
 * Remove formatação de CPF
 * @param value - CPF formatado
 * @returns Apenas dígitos
 */
export function parseCPF(value: string): string {
  if (!value) return "";
  return value.replace(/\D/g, "");
}

// ============================================================================
// 🎯 UTILITÁRIOS GERAIS
// ============================================================================

/**
 * Capitaliza primeira letra de cada palavra
 * @param text - Texto a capitalizar
 * @returns Texto capitalizado
 */
export function capitalize(text: string): string {
  if (!text) return "";

  return text
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Converte para maiúsculas mantendo acentos
 * @param text - Texto a converter
 * @returns Texto em maiúsculas
 */
export function toUpperCaseBR(text: string): string {
  return text?.toUpperCase() || "";
}

/**
 * Converte para minúsculas mantendo acentos
 * @param text - Texto a converter
 * @returns Texto em minúsculas
 */
export function toLowerCaseBR(text: string): string {
  return text?.toLowerCase() || "";
}

/**
 * Remove acentos de texto
 * @param text - Texto com possíveis acentos
 * @returns Texto sem acentos
 */
export function removeAccents(text: string): string {
  if (!text) return "";

  return text.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}
