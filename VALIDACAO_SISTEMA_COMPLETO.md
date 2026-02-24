# 🔐 Sistema de Validações do BarStock

Documentação completa do sistema robusto de validações, sanitização e formatação implementado.

## 📑 Índice

- [Visão Geral](#visão-geral)
- [Estrutura de Arquivos](#estrutura-de-arquivos)
- [Validadores](#validadores)
- [Formatadores](#formatadores)
- [Hooks](#hooks)
- [Componentes de Input](#componentes-de-input)
- [Exemplos de Uso](#exemplos-de-uso)
- [Boas Práticas](#boas-práticas)
- [Integração com Backend](#integração-com-backend)

---

## 🎯 Visão Geral

O sistema de validações do BarStock foi projetado com foco em:

✅ **Segurança:** Bloqueio de caracteres perigosos (XSS, injeção HTML)  
✅ **Confiabilidade:** Validações específicas do domínio (Produto, Fornecedor, Usuário)  
✅ **UX:** Mensagens de erro claras e validação em tempo real  
✅ **Reutilização:** Funções genéricas aplicáveis em múltiplos contextos  
✅ **Manutenibilidade:** Código organizado e bem documentado

---

## 📁 Estrutura de Arquivos

```
src/
├── utils/
│   ├── validators.ts        # Todas as funções de validação
│   ├── formatters.ts        # Todas as funções de formatação
│   └── index.ts             # Exports centralizados
├── hooks/
│   └── useFormValidation.ts # Hook reutilizável para formulários
├── components/
│   ├── shared/
│   │   ├── FormInput.jsx         # Input genérico com validação
│   │   ├── FormCurrencyInput.jsx # Input especializado para moeda
│   │   ├── FormPhoneInput.jsx    # Input especializado para telefone
│   │   └── FormCNPJInput.jsx     # Input especializado para CNPJ
│   ├── produtos/
│   │   ├── ProdutoFormV2.jsx     # Formulário de produto validado
│   │   └── MovimentacaoFormV2.jsx # Formulário de movimentação
│   └── fornecedores/
│       └── FornecedorFormV2.jsx  # Formulário de fornecedor validado
└── pages/
    └── SignUpFormV2.jsx         # Forma de cadastro com validações
```

---

## 🔍 Validadores

### 🔐 Segurança - Sanitização

```typescript
import {
  sanitizeInput,
  containsMaliciousPattern,
  validateSafeInput,
} from "@/utils/validators";

// Remove caracteres de controle e espaços múltiplos
const clean = sanitizeInput("<script>alert('xss')</script>");
// Resultado: "script alert xss /script"

// Detecta padrões maliciosos
if (containsMaliciousPattern("javascript:alert()")) {
  console.log("Padrão malicioso detectado!");
}

// Validação completa
const result = validateSafeInput(userInput);
if (!result.isValid) {
  console.log(result.error); // "Caracteres inválidos..."
}
```

**Padrões bloqueados:**

- `<script>...</script>` - Script tags
- `<iframe>...</iframe>` - Frames
- `<img>` - Img tags
- `javascript:` - Protocol handler
- `on*=` - Event handlers (onerror, onclick, etc)
- `eval()` - Eval function
- `expression()` - CSS expressions

---

### 📦 Produto

```typescript
import {
  validateProductName,
  validateProductDescription,
  validatePrice,
  validateQuantity,
  validateProductForm,
} from "@/utils/validators";

// Validação individual
const nameValidation = validateProductName("Skol 600ml");
if (!nameValidation.isValid) {
  console.error(nameValidation.error);
}

// Validação de preço
const priceValidation = validatePrice("12.50");
if (!priceValidation.isValid) {
  console.error("Preço inválido");
}

// Validação de quantidade
const qtyValidation = validateQuantity("100");
if (!qtyValidation.isValid) {
  console.error("Quantidade inválida");
}

// Validação completa do formulário
const formValidation = validateProductForm({
  nome: "Skol 600ml",
  descricao: "Cerveja clara",
  precoVenda: "5.50",
  quantidade: "100",
});

if (!formValidation.isValid) {
  // formValidation.errors = { campo: "mensagem de erro" }
  Object.entries(formValidation.errors).forEach(([field, error]) => {
    console.error(`${field}: ${error}`);
  });
}
```

**Regras de Validação:**

| Campo          | Regra                                                             |
| -------------- | ----------------------------------------------------------------- |
| **Nome**       | Obrigatório, 3-100 caracteres, apenas letras/números/espaço/hífen |
| **Descrição**  | Opcional, máx 255 caracteres, sem HTML                            |
| **Preço**      | Apenas números, não negativo, máx R$ 999.999,99                   |
| **Quantidade** | Inteiro, não negativo, máx 999.999                                |

---

### 🚚 Fornecedor

```typescript
import {
  validateSupplierName,
  validatePhoneBR,
  validateCNPJ,
  validateSupplierForm,
} from "@/utils/validators";

// Validar telefone
const phoneValidation = validatePhoneBR("11999999999");
// OK se 10-11 dígitos

// Validar CNPJ com cálculo de dígito verificador
const cnpjValidation = validateCNPJ("00.000.000/0000-00");
// Valida automaticamente

// Validação completa
const formValidation = validateSupplierForm({
  nome: "Distribuidora ABC",
  telefone: "(31) 99999-9999",
  cnpj: "12.345.678/0001-90",
  email: "contato@dist.com.br",
});
```

**Regras:**

| Campo        | Regra                                      |
| ------------ | ------------------------------------------ |
| **Nome**     | Obrigatório, 3-150 caracteres              |
| **Telefone** | Opcional, 10-11 dígitos                    |
| **CNPJ**     | Opcional, validação com dígito verificador |

---

### 👤 Usuário

```typescript
import {
  validateEmail,
  validatePassword,
  validateUsername,
  validateUserForm,
} from "@/utils/validators";

// Validar email
const emailValidation = validateEmail("user@example.com");
if (!emailValidation.isValid) {
  console.error("Email inválido: ", emailValidation.error);
}

// Validar senha (forte)
const passwordValidation = validatePassword("minha@Senha123");
if (!passwordValidation.isValid) {
  console.error("Senha fraca: ", passwordValidation.error);
}

// Validar nome de usuário
const usernameValidation = validateUsername("user_name-123");
if (!usernameValidation.isValid) {
  console.error("Usuário inválido: ", usernameValidation.error);
}

// Validação completa
const userForm = validateUserForm({
  username: "user_123",
  email: "user@example.com",
  password: "StrongPass123",
  passwordConfirm: "StrongPass123",
});
```

**Regras de Senha:**

- Mínimo 8 caracteres
- Pelo menos 1 letra (a-z, A-Z)
- Pelo menos 1 número (0-9)
- Sem espaços
- Não permite sequências simples (123456, password, etc)

---

### 🔄 Movimentação

```typescript
import {
  validateMovementObservation,
  validateMovementType,
} from "@/utils/validators";

const typeValidation = validateMovementType("entrada");
// OK: "entrada", "saída", "ajuste"

const obsValidation = validateMovementObservation("Ajuste de estoque");
// OK: máx 200 caracteres, sem HTML
```

---

## 💰 Formatadores

### Moeda Brasileira

```typescript
import {
  formatCurrencyBR,
  parseCurrencyBR,
  formatCurrencyInput,
} from "@/utils/formatters";

// Formatar número como moeda
const formatted = formatCurrencyBR("12.50");
// Resultado: "R$ 12,50"

// Parse de moeda formatada
const parsed = parseCurrencyBR("R$ 12,50");
// Resultado: 12.5

// Formatar input em tempo real
const inputValue = formatCurrencyInput("1250");
// Resultado: "12,50"
```

---

### Telefone Brasileiro

```typescript
import { formatPhoneBR, parsePhoneBR } from "@/utils/formatters";

// Máscara automática
const formatted = formatPhoneBR("11999999999");
// Resultado: "(11) 99999-9999"

// Parse de telefone formatado
const parsed = parsePhoneBR("(11) 99999-9999");
// Resultado: "11999999999"
```

---

### CNPJ

```typescript
import { formatCNPJ, parseCNPJ } from "@/utils/formatters";

// Máscara automática
const formatted = formatCNPJ("12345678000190");
// Resultado: "12.345.678/0001-90"

// Parse de CNPJ formatado
const parsed = parseCNPJ("12.345.678/0001-90");
// Resultado: "12345678000190"
```

---

### Data e Hora

```typescript
import {
  formatDateBR,
  formatDateTimeBR,
  formatTimeBR,
  formatRelativeTime,
} from "@/utils/formatters";

// Data em formato brasileiro
const date = formatDateBR("2024-02-23");
// Resultado: "23/02/2024"

// Data com hora
const dateTime = formatDateTimeBR("2024-02-23T14:30:00");
// Resultado: "23/02/2024 14:30"

// Hora
const time = formatTimeBR(new Date());
// Resultado: "14:30"

// Tempo relativo
const relative = formatRelativeTime(Date.now() - 120000);
// Resultado: "há 2 minutos"
```

---

## 🎣 Hooks

### useFormValidation

Hook reutilizável para gerenciar validações em formulários.

```typescript
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateProductName,
  validatePrice,
  sanitizeInput,
} from "@/utils/validators";

export function MeuFormulario() {
  const {
    // Estado
    values,           // Valores do formulário
    errors,           // Erros por campo
    touched,          // Campos que foram tocados

    // Handlers
    handleChange,     // onChange
    handleBlur,       // onBlur
    handleSubmit,     // onSubmit

    // Setters manuais
    setFieldValue,    // Definir valor de um campo
    setFieldError,    // Definir erro de um campo

    // Helpers
    isValid,          // Formulário é válido?
    shouldShowError,  // Deve exibir erro?
    isFieldTouched,   // Campo foi tocado?
    getFieldError,    // Obter erro de um campo

    // Limpadores
    resetValues,      // Resetar tudo
    clearErrors,      // Limpar todos os erros
    clearFieldError,  // Limpar erro de um campo
  } = useFormValidation(
    // Valores iniciais
    {
      nome: "",
      preco: "",
    },
    // Configuração de validadores
    {
      nome: {
        validator: validateProductName,
        sanitizer: sanitizeInput,
        validateOnChange: true,  // Validar conforme digita
      },
      preco: {
        validator: validatePrice,
        validateOnChange: true,
      },
    }
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input
        name="nome"
        value={values.nome}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {shouldShowError("nome") && (
        <span className="error">{errors.nome}</span>
      )}
    </form>
  );
}
```

**Opções de Validador:**

```typescript
interface FieldValidationConfig {
  validator: (value: any) => { isValid: boolean; error?: string };
  sanitizer?: (value: any) => any; // Função para limpar o dado
  validateOnChange?: boolean; // Default: true
  validateOnBlur?: boolean; // Default: false
}
```

---

## 🎨 Componentes de Input

### FormInput

Input genérico com validação integrada.

```jsx
import FormInput from "@/components/shared/FormInput";

<FormInput
  label="Nome do Produto"
  name="nome"
  value={form.nome}
  onChange={handleChange}
  onBlur={handleBlur}
  error={shouldShowError("nome") ? errors.nome : undefined}
  placeholder="Ex: Skol 600ml"
  required={true}
  maxLength={100}
  showCharCount={true} // Mostra "50/100"
  hint="Digite o nome do produto"
/>;
```

---

### FormCurrencyInput

Input especializado para moeda com formatação automática.

```jsx
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";

<FormCurrencyInput
  label="Preço de Venda"
  name="precoVenda"
  value={form.precoVenda}
  onChange={handleChange}
  error={shouldShowError("precoVenda") ? errors.precoVenda : undefined}
  required={true}
  minimum={0}
  maximum={999999.99}
/>;
```

---

### FormPhoneInput

Input com máscara automática para telefone.

```jsx
import FormPhoneInput from "@/components/shared/FormPhoneInput";

<FormPhoneInput
  label="Telefone"
  name="telefone"
  value={form.telefone}
  onChange={handleChange}
  error={shouldShowError("telefone") ? errors.telefone : undefined}
  placeholder="(11) 99999-9999"
/>;
```

---

### FormCNPJInput

Input com máscara automática para CNPJ.

```jsx
import FormCNPJInput from "@/components/shared/FormCNPJInput";

<FormCNPJInput
  label="CNPJ"
  name="cnpj"
  value={form.cnpj}
  onChange={handleChange}
  error={shouldShowError("cnpj") ? errors.cnpj : undefined}
/>;
```

---

## 📚 Exemplos de Uso

### ProdutoFormV2 - Exemplo Completo

```jsx
import ProdutoFormV2 from "@/components/produtos/ProdutoFormV2";

// Usar em uma página
<ProdutoFormV2
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  produto={null} // null = novo, ou objeto editado
  estabelecimentoId={estabelecimentoId}
/>;
```

Características:

- ✅ Validação em tempo real
- ✅ Validação no submit
- ✅ Formatação de moeda automática
- ✅ Contador de caracteres
- ✅ Mensagens de erro e sucesso
- ✅ Sanitização de input
- ✅ Desabilita botão se há erros

---

### FornecedorFormV2

```jsx
<FornecedorFormV2
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  fornecedor={null}
  estabelecimentoId={estabelecimentoId}
/>
```

Características:

- ✅ Validação de telefone com máscara
- ✅ Validação de CNPJ com dígito verificador
- ✅ Validação de email
- ✅ Integração com validadores

---

### SignUpFormV2

```jsx
import SignUpFormV2 from "@/pages/SignUpFormV2";

// Usar como página de cadastro
<Route path="/signup" element={<SignUpFormV2 />} />;
```

Características:

- ✅ Validação robusta de senha
- ✅ Confirmação de senha
- ✅ Toggle show/hide password
- ✅ Validação de email e username
- ✅ Feedback visual das senhas

---

## ✨ Boas Práticas

### 1. Sempre Usar Hook em Formulários

```jsx
// ✅ BOM
const { values, errors, handleChange, handleSubmit } = useFormValidation(
  { nome: "", email: "" },
  validators,
);

// ❌ EVITAR
const [nome, setNome] = useState("");
const [errors, setErrors] = useState({});
// ... validação manual
```

### 2. Sanitizar Sempre na Entrada

```jsx
// ✅ BOM
{
  nome: {
    validator: validateProductName,
    sanitizer: sanitizeInput,  // Remove caracteres perigosos
  }
}

// ❌ EVITAR
// Não sanitizar permite tagsHTML
```

### 3. Mostrar Erro Apenas Após Toque

```jsx
// ✅ BOM
{
  shouldShowError("nome") && <span>{errors.nome}</span>;
}

// ❌ EVITAR
{
  errors.nome && <span>{errors.nome}</span>;
}
// Mostra erro mesmo sem o usuário escrever
```

### 4. Desabilitar Submit Se Há Erros

```jsx
// ✅ BOM
<button type="submit" disabled={!isValid}>
  Salvar
</button>

// ❌ EVITAR
<button type="submit">Salvar</button>
// Permite submit com erros
```

### 5. Tratarros do Servidor

```jsx
const onSubmit = async (values) => {
  try {
    await api.post("/produtos", values);
  } catch (error) {
    // ✅ BOM - Mostrar erro ao usuário
    setFieldError("nome", error.response.data.message);
  }
};
```

---

## 🔗 Integração com Backend

### API de Validação do Backend

Prepare o backend para aceitar validações:

```typescript
// Backend - Rota de Criar Produto
POST /api/produtos
Body: {
  nome: "Skol 600ml",
  descricao: "...",
  precoVenda: 5.50,
  quantidade: 100
}

Response (sucesso):
{
  id: "123",
  message: "Produto criado com sucesso"
}

Response (erro):
{
  errors: {
    nome: "Nome já existe",
    precoVenda: "Preço deve ser maior que custo"
  }
}
```

### Sincronizar Erros Frontend + Backend

```jsx
const onSubmit = async (formValues) => {
  try {
    const response = await api.post("/produtos", formValues);
    // Sucesso
  } catch (error) {
    // Aplicar erros do backend aos campos
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([field, message]) => {
        setFieldError(field, message);
      });
    }
  }
};
```

---

## 🛡️ Segurança Extra

### Nunca Usar dangerouslySetInnerHTML

```jsx
// ❌ NUNCA FAÇA
<div dangerouslySetInnerHTML={{ __html: userInput }} />

// ✅ BOM
<div>{sanitizedInput}</div>
```

### Futura Integração com DOMPurify

```typescript
import DOMPurify from "dompurify";

export function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}
```

---

## 🚀 Próximos Passos

- [ ] Integrar DOMPurify para sanitização extra
- [ ] Adicionar validação de CPF
- [ ] Adicionar validação de cálculo de CNPJ no backend
- [ ] Implementar rate limiting para tentativas de submit
- [ ] Adicionar testes unitários para validadores
- [ ] Implementar validação assíncrona (verificar email/username disponível)
- [ ] Adicionar suporte a validação multilingue

---

## 📞 Suporte

Para dúvidas sobre as validações, consulte os arquivos:

- `src/utils/validators.ts` - Documentação de cada validador
- `src/utils/formatters.ts` - Documentação de cada formatador
- `src/hooks/useFormValidation.ts` - Documentação do hook
