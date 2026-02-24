# ⚡ Quick Start - Sistema de Validações

Guia rápido para começar a usar o sistema de validações.

## 1️⃣ Importar Validadores e Formatadores

```typescript
import {
  // Validadores
  sanitizeInput,
  validateProductName,
  validateEmail,
  validatePassword,
  validatePhoneBR,
  validateCNPJ,

  // Formatadores
  formatCurrencyBR,
  formatPhoneBR,
  formatCNPJ,
} from "@/utils/validators";
```

## 2️⃣ Usar Hook em Um Formulário

```jsx
import { useFormValidation } from "@/hooks/useFormValidation";
import {
  validateProductName,
  validatePrice,
  sanitizeInput,
} from "@/utils/validators";
import FormInput from "@/components/shared/FormInput";
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";

export default function MeuFormulario() {
  const {
    values,
    errors,
    handleChange,
    handleBlur,
    handleSubmit,
    shouldShowError,
  } = useFormValidation(
    { nome: "", preco: "" },
    {
      nome: {
        validator: validateProductName,
        sanitizer: sanitizeInput,
        validateOnChange: true,
      },
      preco: {
        validator: validatePrice,
        validateOnChange: true,
      },
    },
  );

  const onSubmit = async (formValues) => {
    console.log("Dados válidos:", formValues);
    // enviar para backend
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <FormInput
        label="Nome"
        name="nome"
        value={values.nome}
        onChange={handleChange}
        onBlur={handleBlur}
        error={shouldShowError("nome") ? errors.nome : undefined}
        required={true}
      />

      <FormCurrencyInput
        label="Preço"
        name="preco"
        value={values.preco}
        onChange={handleChange}
        error={shouldShowError("preco") ? errors.preco : undefined}
        required={true}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
```

## 3️⃣ Inputs Especializados

### Telefone com Máscara

```jsx
import FormPhoneInput from "@/components/shared/FormPhoneInput";

<FormPhoneInput
  label="Telefone"
  name="telefone"
  value={values.telefone}
  onChange={handleChange}
  error={shouldShowError("telefone") ? errors.telefone : undefined}
/>;
```

### CNPJ com Máscara e Validação

```jsx
import FormCNPJInput from "@/components/shared/FormCNPJInput";

<FormCNPJInput
  label="CNPJ"
  name="cnpj"
  value={values.cnpj}
  onChange={handleChange}
  error={shouldShowError("cnpj") ? errors.cnpj : undefined}
/>;
```

## 4️⃣ Validar Dados Simples (Sem Hook)

```typescript
import { validateEmail, validatePassword } from "@/utils/validators";

// Validar email
const emailResult = validateEmail("user@example.com");
if (!emailResult.isValid) {
  console.error(emailResult.error);
} else {
  console.log("Email válido!");
}

// Validar senha
const passwordResult = validatePassword("MinhaSenha123");
if (!passwordResult.isValid) {
  console.error(passwordResult.error);
}
```

## 5️⃣ Formatar Dados Para Exibição

```typescript
import {
  formatCurrencyBR,
  formatPhoneBR,
  formatCNPJ,
  formatDateBR,
  parseCurrencyBR,
  parsePhoneBR,
} from "@/utils/formatters";

// Formatar moeda
const preço = formatCurrencyBR(12.5);
// Resultado: "R$ 12,50"

// Formatar telefone
const tel = formatPhoneBR("11999999999");
// Resultado: "(11) 99999-9999"

// Formatar CNPJ
const cnpj = formatCNPJ("12345678000190");
// Resultado: "12.345.678/0001-90"

// Parse para obter valores brutos
const valor = parseCurrencyBR("R$ 12,50");
// Resultado: 12.5

const numeros = parsePhoneBR("(11) 99999-9999");
// Resultado: "11999999999"
```

## 6️⃣ Tratar Erros do Servidor

```jsx
const onSubmit = async (formValues) => {
  try {
    const response = await api.post("/produtos", formValues);
    // Sucesso
    console.log("Salvo!");
  } catch (error) {
    // Se o erro vem do backend com campos específicos
    if (error.response?.data?.errors) {
      Object.entries(error.response.data.errors).forEach(([field, message]) => {
        setFieldError(field, message);
      });
    } else {
      // Erro genérico
      setServerError(error.message);
    }
  }
};
```

## 7️⃣ Exemplos Reais

### Formulário de Produto

```jsx
import ProdutoFormV2 from "@/components/produtos/ProdutoFormV2";

// Em sua página/componente
const [openDialog, setOpenDialog] = useState(false);
const [selectedProduct, setSelectedProduct] = useState(null);

return (
  <>
    <button onClick={() => setOpenDialog(true)}>Novo Produto</button>

    <ProdutoFormV2
      open={openDialog}
      onClose={() => setOpenDialog(false)}
      produto={selectedProduct}
      estabelecimentoId={estabelecimentoId}
    />
  </>
);
```

### Formulário de Fornecedor

```jsx
import FornecedorFormV2 from "@/components/fornecedores/FornecedorFormV2";

<FornecedorFormV2
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  fornecedor={selectedSupplier}
  estabelecimentoId={estabelecimentoId}
/>;
```

### Formulário de Movimentação

```jsx
import MovimentacaoFormV2 from "@/components/produtos/MovimentacaoFormV2";

<MovimentacaoFormV2
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  produtoId={produtoId}
  produtoNome={produtoNome}
  estabelecimentoId={estabelecimentoId}
  onSuccess={() => recarregarEstoque()}
/>;
```

### Cadastro de Usuário

```jsx
import SignUpFormV2 from "@/pages/SignUpFormV2";

// Em suas rotas
<Route path="/signup" element={<SignUpFormV2 />} />;
```

## 🛠️ Customização

### Criar Um Novo Validador

```typescript
// src/utils/validators.ts

export function validateMeuCampo(value: string): {
  isValid: boolean;
  error?: string;
} {
  if (!value) {
    return { isValid: false, error: "Campo obrigatório" };
  }

  if (value.length < 5) {
    return { isValid: false, error: "Mínimo 5 caracteres" };
  }

  if (!/^[a-z0-9]+$/i.test(value)) {
    return {
      isValid: false,
      error: "Apenas letras e números permitidos",
    };
  }

  return { isValid: true };
}
```

### Usar o Novo Validador

```jsx
import { validateMeuCampo } from "@/utils/validators";

const { values, errors, handleChange } = useFormValidation(
  { meuCampo: "" },
  {
    meuCampo: {
      validator: validateMeuCampo,
      validateOnChange: true,
    },
  },
);
```

## 🎯 Checklist para Novo Formulário

- [ ] Criar componente com `useFormValidation`
- [ ] Adicionar validadores apropiados
- [ ] Opcionalmente: adicionar sanitizadores
- [ ] Usar `FormInput` ou componentes especializados
- [ ] Mostrar erros apenas com `shouldShowError`
- [ ] Desabilitar botão submit se `!isValid`
- [ ] Tratar erros do servidor com `setFieldError`
- [ ] Testar validação em tempo real (onChange)
- [ ] Testar validação no submit
- [ ] Testar com dados maliciosos (<script>, etc)

## 📖 Referência Rápida de Validadores

| Validador             | Entrada              | Retorna             |
| --------------------- | -------------------- | ------------------- |
| `validateProductName` | "Skol"               | `{ isValid: true }` |
| `validateEmail`       | "user@test.com"      | `{ isValid: true }` |
| `validatePassword`    | "Pass123"            | `{ isValid: true }` |
| `validatePhoneBR`     | "11999999999"        | `{ isValid: true }` |
| `validateCNPJ`        | "00.000.000/0000-00" | `{ isValid: true }` |
| `validatePrice`       | "12.50"              | `{ isValid: true }` |
| `validateQuantity`    | "100"                | `{ isValid: true }` |

## 📖 Referência Rápida de Formatadores

| Formatador         | Entrada           | Resultado            |
| ------------------ | ----------------- | -------------------- |
| `formatCurrencyBR` | 12.5              | "R$ 12,50"           |
| `formatPhoneBR`    | "11999999999"     | "(11) 99999-9999"    |
| `formatCNPJ`       | "12345678000190"  | "12.345.678/0001-90" |
| `formatQuantity`   | 1000              | "1.000"              |
| `formatDateBR`     | "2024-02-23"      | "23/02/2024"         |
| `parseCurrencyBR`  | "R$ 12,50"        | 12.5                 |
| `parsePhoneBR`     | "(11) 99999-9999" | "11999999999"        |

---

**Documentação Completa:** Veja `VALIDACAO_SISTEMA_COMPLETO.md`
