# 🚀 Cheat Sheet - Referência Rápida

Uma página de referência rápida para consultar como usar cada validador, formatador e componente.

---

## 📌 Índice Rápido

- [Validadores](#validadores)
- [Formatadores](#formatadores)
- [Hook useFormValidation](#hook)
- [Componentes](#componentes)
- [Exemplos Combinados](#exemplos-combinados)

---

## 🔍 Validadores

### Import

```typescript
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
  validateProductForm,

  // Fornecedor
  validateSupplierName,
  validatePhoneBR,
  validateCNPJ,
  validateSupplierForm,

  // Usuário
  validateEmail,
  validateUsername,
  validatePassword,
  validateUserForm,

  // Movimentação
  validateMovementType,
  validateMovementObservation,
} from "@/utils/validators";
```

### Segurança

#### `sanitizeInput(value: string): string`

Limpa entrada removendo HTML e controle de caracteres.

```jsx
const clean = sanitizeInput("<script>alert('xss')</script>");
// Resultado: "alert('xss')"

const text = sanitizeInput("Cerveja Premium");
// Resultado: "Cerveja Premium"
```

#### `validateSafeInput(value: string): { isValid: boolean; error?: string }`

Valida se entrada é segura.

```jsx
const result = validateSafeInput("Cerveja");
// { isValid: true }

const result = validateSafeInput("<img onerror='alert()'>");
// { isValid: false, error: "Contém padrão malicioso" }
```

---

### Produto

#### `validateProductName(name: string): { isValid: boolean; error?: string }`

3-100 caracteres, letters, números, hífens, espaços.

```jsx
validateProductName("Skol 600ml"); // { isValid: true }
validateProductName("ab"); // { isValid: false, error: "Mínimo 3..." }
validateProductName("a".repeat(101)); // { isValid: false, error: "Máximo 100..." }
```

#### `validatePrice(price: number | string): { isValid: boolean; error?: string }`

Maior que 0, máximo R$ 999.999,99

```jsx
validatePrice(12.5); // { isValid: true }
validatePrice(-5); // { isValid: false, error: "Deve ser positivo" }
validatePrice(1000000); // { isValid: false, error: "Máximo R$ 999.999,99" }
```

#### `validateQuantity(qty: number | string): { isValid: boolean; error?: string }`

Inteiro, máximo 999.999

```jsx
validateQuantity(100); // { isValid: true }
validateQuantity(100.5); // { isValid: false, error: "Deve ser inteiro" }
validateQuantity(1000000); // { isValid: false }
```

#### `validateProductDescription(desc: string): { isValid: boolean; error?: string }`

0-500 caracteres

```jsx
validateProductDescription("Boa cerveja"); // { isValid: true }
validateProductDescription("a".repeat(501)); // { isValid: false }
```

---

### Fornecedor

#### `validateSupplierName(name: string): { isValid: boolean; error?: string }`

3-150 caracteres

```jsx
validateSupplierName("Distribuidora ABC"); // { isValid: true }
validateSupplierName("ab"); // { isValid: false }
```

#### `validatePhoneBR(phone: string): { isValid: boolean; error?: string }`

10-11 dígitos (com ou sem máscara)

```jsx
validatePhoneBR("11999999999"); // { isValid: true }
validatePhoneBR("(11) 99999-9999"); // { isValid: true }
validatePhoneBR("119999"); // { isValid: false }
```

#### `validateCNPJ(cnpj: string): { isValid: boolean; error?: string }`

Valida estrutura e dígitos verificadores

```jsx
validateCNPJ("11.222.333/0001-81"); // { isValid: true }
validateCNPJ("11222333000181"); // { isValid: true }
validateCNPJ("00.000.000/0000-00"); // { isValid: false }
```

#### `validateEmail(email: string): { isValid: boolean; error?: string }`

Email válido, sem espaços

```jsx
validateEmail("usuario@exemplo.com"); // { isValid: true }
validateEmail("usuario @exemplo.com"); // { isValid: false }
validateEmail("usuario"); // { isValid: false }
```

---

### Usuário

#### `validatePassword(password: string): { isValid: boolean; error?: string }`

8+ caracteres, letra, número, sem espaços

```jsx
validatePassword("Senha123"); // { isValid: true }
validatePassword("senha"); // { isValid: false }
validatePassword("Senha 123"); // { isValid: false (espaço) }
```

#### `validateUsername(username: string): { isValid: boolean; error?: string }`

3-50 caracteres, alfanuméricos \_

```jsx
validateUsername("usuario_123"); // { isValid: true }
validateUsername("ab"); // { isValid: false }
validateUsername("usuario@"); // { isValid: false }
```

---

### Movimentação

#### `validateMovementType(type: string): { isValid: boolean; error?: string }`

Deve ser: entrada, saída, ou ajuste

```jsx
validateMovementType("entrada"); // { isValid: true }
validateMovementType("saída"); // { isValid: true }
validateMovementType("venda"); // { isValid: false }
```

#### `validateMovementObservation(obs: string): { isValid: boolean; error?: string }`

0-200 caracteres, sem XSS

```jsx
validateMovementObservation("Nota fiscal 123"); // { isValid: true }
validateMovementObservation("<script>alert()</script>"); // { isValid: false }
```

---

## 🎨 Formatadores

### Import

```typescript
import {
  // Moeda
  formatCurrencyBR,
  parseCurrencyBR,
  formatCurrencyInput,
  parseCurrencyInput,

  // Telefone
  formatPhoneBR,
  parsePhoneBR,
  formatPhoneInput,

  // CNPJ
  formatCNPJ,
  parseCNPJ,
  formatCNPJInput,

  // CPF
  formatCPF,
  parseCPF,

  // Data
  formatDateBR,
  formatRelativeTime,
  formatDatetimeBR,

  // Texto
  formatQuantity,
  formatPercentage,
  parseQuantity,
} from "@/utils/formatters";
```

### Moeda

#### `formatCurrencyBR(value: number | string | null): string`

Formata para exibição (R$ 12,50)

```jsx
formatCurrencyBR(12.5); // "R$ 12,50"
formatCurrencyBR(1500); // "R$ 1.500,00"
formatCurrencyBR(null); // "R$ 0,00"
```

#### `parseCurrencyBR(value: string): number`

Converte de volta para número

```jsx
parseCurrencyBR("R$ 12,50"); // 12.5
parseCurrencyBR("R$ 1.500,00"); // 1500
```

#### `formatCurrencyInput(value: string): string`

Formata enquanto digita (sem "R$")

```jsx
formatCurrencyInput("1250"); // "12,50"
formatCurrencyInput("150000"); // "1.500,00"
```

---

### Telefone

#### `formatPhoneBR(phone: string): string`

Formata para (XX) XXXXX-XXXX

```jsx
formatPhoneBR("11999999999"); // "(11) 99999-9999"
formatPhoneBR("1133334444"); // "(11) 3333-4444"
```

#### `parsePhoneBR(phone: string): string`

Remove formatação

```jsx
parsePhoneBR("(11) 99999-9999"); // "11999999999"
parseInt PhoneBR("(11) 3333-4444"); // "1133334444"
```

#### `formatPhoneInput(value: string): string`

Formata em tempo real

```jsx
formatPhoneInput("119"); // "(11) 9"
formatPhoneInput("1199999"); // "(11) 99999"
```

---

### CNPJ

#### `formatCNPJ(cnpj: string): string`

Formata para XX.XXX.XXX/XXXX-XX

```jsx
formatCNPJ("11222333000181"); // "11.222.333/0001-81"
```

#### `parseCNPJ(cnpj: string): string`

Remove formatação

```jsx
parseCNPJ("11.222.333/0001-81"); // "11222333000181"
```

#### `formatCNPJInput(value: string): string`

Formata em tempo real

```jsx
formatCNPJInput("1122"); // "11.22"
formatCNPJInput("1122233"); // "11.222.33"
```

---

### Data

#### `formatDateBR(date: Date | string | null): string`

Formata para dd/mm/aaaa

```jsx
formatDateBR(new Date("2026-02-23")); // "23/02/2026"
formatDateBR("2026-02-23"); // "23/02/2026"
```

#### `formatRelativeTime(date: Date | string): string`

Formata relativo (há 2 minutos)

```jsx
formatRelativeTime(new Date()); // "há poucos segundos"
formatRelativeTime(Date.now() - 60000); // "há 1 minuto"
```

#### `formatDatetimeBR(date: Date | string): string`

Data e hora: dd/mm/aaaa hh:mm

```jsx
formatDatetimeBR(new Date()); // "23/02/2026 14:30"
```

---

### Quantidade

#### `formatQuantity(qty: number | string): string`

Formata com separador de milhares

```jsx
formatQuantity(1234); // "1.234"
formatQuantity(1000000); // "1.000.000"
```

#### `parseQuantity(qty: string): number`

Remove formatação

```jsx
parseQuantity("1.234"); // 1234
parseQuantity("1.000.000"); // 1000000
```

---

## 🪝 Hook useFormValidation

### Basic Usage

```jsx
const {
  values, // { [fieldName]: value }
  errors, // { [fieldName]: errorMessage }
  touched, // { [fieldName]: boolean }
  handleChange, // (e: ChangeEvent) => void
  handleBlur, // (e: FocusEvent) => void
  handleSubmit, // (callback: (values) => void) => (e: FormEvent) => void
  setFieldValue, // (fieldName: string, value: any) => void
  setFieldError, // (fieldName: string, error: string) => void
  isValid, // boolean
  shouldShowError, // (fieldName: string) => boolean
  validateField, // (fieldName: string) => boolean
  validateAll, // () => boolean
  resetForm, // () => void
} = useFormValidation(initialValues, validators);
```

### Exemplo Simples

```jsx
const { values, errors, handleChange, handleSubmit } = useFormValidation(
  { nome: "", email: "" },
  {
    nome: validateProductName,
    email: validateEmail,
  },
);

return (
  <form onSubmit={handleSubmit(onSubmit)}>
    <input name="nome" value={values.nome} onChange={handleChange} />
    {errors.nome && <div>{errors.nome}</div>}

    <button type="submit">Enviar</button>
  </form>
);
```

### Validadores Por Champ

```jsx
const { values, errors, handleChange } = useFormValidation(
  { campo1: "", campo2: "" },
  {
    campo1: {
      validator: validateProductName,
      validateOnChange: true, // Validar enquanto digita
      validateOnBlur: false,
      sanitizer: true, // Sanitizar entrada
    },
    campo2: {
      validator: validatePrice,
      validateOnChange: false,
      validateOnBlur: true, // Validar ao sair do campo
      sanitizer: false,
    },
  },
);
```

### Tratamento de Erros Servidor

```jsx
const { setFieldError } = useFormValidation(" , validators);

const handleSubmit = async (values) => {
  try {
    const response = await api.post("/endpoint", values);
  } catch (error) {
    // Mostrar erro em campo específico
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([field, msg]) => {
        setFieldError(field, msg);
      });
    }
  }
};
```

---

## 🧩 Componentes

### FormInput

```jsx
import FormInput from "@/components/shared/FormInput";

<FormInput
  label="Nome" // Label do campo
  name="nome" // Nome do input
  value={values.nome} // Valor atual
  onChange={handleChange} // onChange handler
  onBlur={handleBlur} // onBlur handler (opcional)
  error={shouldShowError("nome") ? errors.nome : undefined} // Mensagem de erro
  placeholder="Digite o nome" // Placeholder
  maxLength={100} // Máximo de caracteres
  required // Mostrar asterisco vermelho
  as="textarea" // "textarea" para texto longo
  icon={BookIcon} // Ícone (opcional)
  hint="Mínimo 3 caracteres" // Dica abaixo do campo
/>;
```

### FormCurrencyInput

```jsx
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";

<FormCurrencyInput
  label="Preço (R$)"
  name="precio"
  value={values.preco}
  onChange={handleChange}
  onBlur={handleBlur}
  error={shouldShowError("preco") ? errors.preco : undefined}
  placeholder="0,00"
  min={0}
  max={999999.99}
  required
/>;
```

###FormPhoneInput

```jsx
import FormPhoneInput from "@/components/shared/FormPhoneInput";

<FormPhoneInput
  label="Telefone"
  name="phone"
  value={values.phone}
  onChange={handleChange}
  onBlur={handleBlur}
  error={shouldShowError("phone") ? errors.phone : undefined}
  placeholder="(XX) XXXXX-XXXX"
  required
/>;
```

### FormCNPJInput

```jsx
import FormCNPJInput from "@/components/shared/FormCNPJInput";

<FormCNPJInput
  label="CNPJ"
  name="cnpj"
  value={values.cnpj}
  onChange={handleChange}
  onBlur={handleBlur}
  error={shouldShowError("cnpj") ? errors.cnpj : undefined}
  placeholder="XX.XXX.XXX/XXXX-XX"
  required
/>;
```

---

## 🔗 Exemplos Combinados

### Formulário de Produto

```jsx
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateProductName, validatePrice } from "@/utils/validators";
import FormInput from "@/components/shared/FormInput";
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";

function ProdutoForm() {
  const {
    values,
    handleChange,
    handleBlur,
    handleSubmit,
    shouldShowError,
    errors,
  } = useFormValidation(
    { nome: "", preco: "" },
    {
      nome: { validator: validateProductName, validateOnChange: true },
      preco: { validator: validatePrice, validateOnBlur: true },
    },
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormInput
        label="Nome"
        name="nome"
        value={values.nome}
        onChange={handleChange}
        error={shouldShowError("nome") ? errors.nome : undefined}
      />

      <FormCurrencyInput
        label="Preço"
        name="preco"
        value={values.preco}
        onChange={handleChange}
        error={shouldShowError("preco") ? errors.preco : undefined}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
```

### Formatação em Exibição

```jsx
import {
  formatCurrencyBR,
  formatPhoneBR,
  formatCNPJ,
} from "@/utils/formatters";

function ListaProdutos({ produtos }) {
  return (
    <ul>
      {produtos.map((p) => (
        <li key={p.id}>
          {p.nome} - {formatCurrencyBR(p.preco)}
        </li>
      ))}
    </ul>
  );
}

function ListaFornecedores({ fornecedores }) {
  return (
    <ul>
      {fornecedores.map((f) => (
        <li key={f.id}>
          {f.nome} - {formatPhoneBR(f.phone)} - {formatCNPJ(f.cnpj)}
        </li>
      ))}
    </ul>
  );
}
```

### Validação Manual

```jsx
import {
  validatePhoneBR,
  validateCNPJ,
  sanitizeInput,
} from "@/utils/validators";

// Validar antes de salvar
function onSaveSupplier(data) {
  const phoneCheck = validatePhoneBR(data.phone);
  if (!phoneCheck.isValid) {
    showError(phoneCheck.error);
    return;
  }

  const cnpjCheck = validateCNPJ(data.cnpj);
  if (!cnpjCheck.isValid) {
    showError(cnpjCheck.error);
    return;
  }

  // Sanitizar antes de enviar
  const cleanData = {
    ...data,
    nome: sanitizeInput(data.nome),
    observations: sanitizeInput(data.observations),
  };

  // Salvar...
}
```

---

## 📚 Links Úteis

- [VALIDACAO_SISTEMA_COMPLETO.md](VALIDACAO_SISTEMA_COMPLETO.md) - Guia completo
- [VALIDACAO_QUICK_START.md](VALIDACAO_QUICK_START.md) - Começar em 5 min
- [GUIA_INTEGRACAO_PRATICO.md](GUIA_INTEGRACAO_PRATICO.md) - Integração passo a passo
- [BACKEND_INTEGRACAO_VALIDACOES.md](BACKEND_INTEGRACAO_VALIDACOES.md) - Backend
- [TESTES_INTEGRACAO_FRONTEND_BACKEND.md](TESTES_INTEGRACAO_FRONTEND_BACKEND.md) - Testes

---

**Última atualização:** 23 de fevereiro de 2026
**Versão:** 1.0
