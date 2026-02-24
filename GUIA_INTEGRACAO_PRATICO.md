# 🔧 Guia Prático: Integrar Validações em Um Formulário

Um guia passo a passo para integrar o sistema de validações em um formulário existente.

---

## 📋 Pré-requisitos

Todos estes arquivos já existem no seu projeto:

```
src/utils/validators.ts       ✅
src/utils/formatters.ts       ✅
src/utils/index.ts            ✅
src/hooks/useFormValidation.ts ✅
src/components/shared/FormInput.jsx ✅
src/components/shared/FormCurrencyInput.jsx ✅
```

---

## 🎯 Exemplo: Modernizar FormOld.jsx

### ANTES (Sem validações)

Arquivo original: `src/components/produtos/ProdutoForm.jsx` (antigo)

```jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function ProdutoForm() {
  const [values, setValues] = useState({
    nome: "",
    category: "",
    preco: "",
    estoque: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setValues({
      ...values,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Sem validação real!
    if (!values.nome || !values.preco) {
      setError("Preencha todos os campos");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/produtos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      if (response.ok) {
        alert("Produto criado!");
        setValues({ nome: "", category: "", preco: "", estoque: "" });
      } else {
        setError("Erro ao salvar");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <div className="text-red-600">{error}</div>}

      <div>
        <label>Nome</label>
        <input name="nome" value={values.nome} onChange={handleChange} />
      </div>

      <div>
        <label>Categoria</label>
        <select name="category" value={values.category} onChange={handleChange}>
          <option>Selecione</option>
          <option>Cerveja</option>
        </select>
      </div>

      <div>
        <label>Preço</label>
        <input
          name="preco"
          type="number"
          value={values.preco}
          onChange={handleChange}
        />
      </div>

      <div>
        <label>Estoque</label>
        <input
          name="estoque"
          type="number"
          value={values.estoque}
          onChange={handleChange}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
```

### Problemas com a versão antiga:

❌ Sem validação em tempo real  
❌ Sem máscara de moeda  
❌ Sem contador de caracteres  
❌ Sem sugestões de erro claras  
❌ Sem tratamento de erros do servidor  
❌ Sem segurança contra XSS

---

## ✅ DEPOIS (Com Validações - Passo a Passo)

### Passo 1: Importações

```jsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle } from "lucide-react";

// ← NOVO: Importar validadores e formatadores
import {
  validateProductName,
  validateProductDescription,
  validatePrice,
  validateQuantity,
} from "@/utils/validators";

// ← NOVO: Importar hook de validação
import { useFormValidation } from "@/hooks/useFormValidation";

// ← NOVO: Importar componentes especializados
import FormInput from "@/components/shared/FormInput";
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";
```

### Passo 2: Configurar Hook

```jsx
export function ProdutoForm() {
  // ← NOVO: Usar hook de validação
  const {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setFieldError,
    shouldShowError,
    validateField,
    isValid
  } = useFormValidation(
    {
      nome: "",
      descricao: "",
      categoria: "",
      preco: "",
      estoque: ""
    },
    {
      // Configurar cada campo
      nome: {
        validator: validateProductName,
        validateOnChange: true,    // Validar enquanto digita
        validateOnBlur: false,
        sanitizer: true            // Sanitizar entrada
      },
      descricao: {
        validator: validateProductDescription,
        validateOnChange: false,   // Validar só no blur
        validateOnBlur: true
      },
      preco: {
        validator: validatePrice,
        validateOnChange: false,
        validateOnBlur: true
      },
      estoque: {
        validator: validateQuantity,
        validateOnChange: false,
        validateOnBlur: true
      }
    }
  );

  // Estados auxiliares
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
```

### Passo 3: Handler de Submissão

```jsx
// ← MODIFICADO: Usar handleSubmit do hook
const onSubmit = async (formValues) => {
  try {
    setLoading(true);
    setServerError("");
    setSuccessMessage("");

    // Aqui formValues já foram validados!
    const response = await fetch("/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formValues),
    });

    const data = await response.json();

    if (response.ok) {
      setSuccessMessage("Produto criado com sucesso!");

      // Limpar formulário
      setTimeout(() => {
        window.location.href = "/produtos";
      }, 1500);
    } else {
      // ← NOVO: Tratar erros do servidor por campo
      if (data.errors) {
        Object.entries(data.errors).forEach(([field, message]) => {
          setFieldError(field, message);
        });
      } else {
        setServerError(data.message || "Erro ao salvar");
      }
    }
  } catch (error) {
    setServerError("Erro de conexão. Tente novamente.");
    console.error(error);
  } finally {
    setLoading(false);
  }
};
```

### Passo 4: Renderizar Formulário

```jsx
  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Novo Produto</h1>

      {/* ← NOVO: Erro genérico do servidor */}
      {serverError && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{serverError}</AlertDescription>
        </Alert>
      )}

      {/* ← NOVO: Mensagem de sucesso */}
      {successMessage && (
        <Alert className="mb-6 bg-green-50 border-green-200">
          <CheckCircle2 className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {successMessage}
          </AlertDescription>
        </Alert>
      )}

      {/* ← MODIFICADO: Usar handleSubmit do hook */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">

        {/* 1. Campo Nome (FormInput genérico) */}
        <FormInput
          label="Nome do Produto"
          name="nome"
          placeholder="Ex: Skol 600ml"
          value={values.nome}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shouldShowError("nome") ? errors.nome : undefined}
          maxLength={100}
          required
        />

        {/* 2. Campo Descrição (com contador) */}
        <FormInput
          label="Descrição"
          name="descricao"
          placeholder="Descreva o produto..."
          value={values.descricao}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shouldShowError("descricao") ? errors.descricao : undefined}
          maxLength={255}
          required
          as="textarea"
        />

        {/* 3. Campo Categoria (simples select) */}
        <div>
          <label className="block text-sm font-medium mb-2">
            Categoria
          </label>
          <select
            name="categoria"
            value={values.categoria}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`w-full px-3 py-2 border rounded-md ${
              shouldShowError("categoria") ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Selecione uma categoria</option>
            <option value="cerveja">Cerveja</option>
            <option value="rum">Rum</option>
            <option value="vodka">Vodka</option>
            <option value="whisky">Whisky</option>
          </select>
          {shouldShowError("categoria") && errors.categoria && (
            <p className="text-red-600 text-sm mt-1">{errors.categoria}</p>
          )}
        </div>

        {/* 4. Campo Preço (FormCurrencyInput pode ser usado aqui) */}
        <FormCurrencyInput
          label="Preço de Venda (R$)"
          name="preco"
          placeholder="0,00"
          value={values.preco}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shouldShowError("preco") ? errors.preco : undefined}
          required
        />

        {/* 5. Campo Estoque (FormInput com type number) */}
        <FormInput
          label="Quantidade em Estoque"
          name="estoque"
          type="number"
          placeholder="0"
          value={values.estoque}
          onChange={handleChange}
          onBlur={handleBlur}
          error={shouldShowError("estoque") ? errors.estoque : undefined}
          required
        />

        {/* Botão de submissão */}
        <div className="flex gap-4">
          <button
            type="submit"
            disabled={!isValid || loading}
            className={`px-6 py-2 rounded-md font-medium ${
              isValid && !loading
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {loading ? "Salvando..." : "Salvar Produto"}
          </button>

          <a
            href="/produtos"
            className="px-6 py-2 rounded-md border border-gray-300 hover:bg-gray-50"
          >
            Cancelar
          </a>
        </div>

        {/* Debug: mostrar estado (remover em produção) */}
        {process.env.NODE_ENV === "development" && (
          <div className="bg-gray-100 p-4 text-xs font-mono">
            <pre>
              isValid: {String(isValid)}
              {"\n"}
              touched: {JSON.stringify(touched, null, 2)}
            </pre>
          </div>
        )}
      </form>
    </div>
  );
}

export default ProdutoForm;
```

---

## 📊 Comparação: Antes vs Depois

### Validação

| Aspecto                 | ANTES        | DEPOIS                   |
| ----------------------- | ------------ | ------------------------ |
| Validação em tempo real | ❌ Não       | ✅ Sim                   |
| Formatação automática   | ❌ Não       | ✅ Sim (moeda, telefone) |
| Erros por campo         | ❌ Genérico  | ✅ Específico            |
| Erros do servidor       | ❌ Não trata | ✅ Por campo             |
| Sanitização             | ❌ Parece    | ✅ XSS safe              |

### UX

| Aspecto               | ANTES                | DEPOIS             |
| --------------------- | -------------------- | ------------------ |
| Feedback ao usuário   | ⚠️ Tardio            | ✅ Imediato        |
| Desabilitar botão     | ❌ Sempre habilitado | ✅ Quando inválido |
| Counter de caracteres | ❌ Não               | ✅ Sim             |
| Máscara de entrada    | ❌ Não               | ✅ Automática      |

### Segurança

| Aspecto           | ANTES         | DEPOIS       |
| ----------------- | ------------- | ------------ |
| XSS Prevention    | ❌ Não        | ✅ Sim       |
| Input Tampering   | ❌ Vulnerável | ✅ Protegido |
| Strong Validation | ❌ Básico     | ✅ Completo  |

---

## 🚀 Resultado Final

Antes:

```jsx
<input
  name="preco"
  type="number"
  value={values.preco}
  onChange={handleChange}
/>
```

Depois:

```jsx
<FormCurrencyInput
  label="Preço de Venda (R$)"
  name="preco"
  value={values.preco}
  onChange={handleChange}
  onBlur={handleBlur}
  error={shouldShowError("preco") ? errors.preco : undefined}
/>
```

Diferenças:
✅ Máscara automática (1500 → R$ 15,00)  
✅ Erro contextual  
✅ Label clara  
✅ Placeholder sugestivo  
✅ Ícone exclusivo

---

## 🔄 Integração com Existente

Se você tem `Produtos.jsx` usando `ProdutoForm.jsx`:

### Antes

```jsx
import ProdutoForm from "./ProdutoForm";

export function Produtos() {
  return (
    <div>
      <ProdutoForm />
    </div>
  );
}
```

### Depois (sem mudanças!)

```jsx
// Import continua o mesmo, mas ProdutoForm agora é melhor
import ProdutoForm from "./ProdutoForm";

export function Produtos() {
  return (
    <div>
      <ProdutoForm /> {/* Agora com validações! */}
    </div>
  );
}
```

---

## 📋 Checklist de Integração

Para cada formulário que quiser modernizar:

- [ ] Importar validadores necessários
- [ ] Importar `useFormValidation`
- [ ] Importar componentes especializados
- [ ] Configurar hook com validators
- [ ] Adaptar JSX (substituir inputs)
- [ ] Implementar tratamento de erro servidor
- [ ] Testar validação em tempo real
- [ ] Testar erro do servidor
- [ ] Testar sanitização (XSS)
- [ ] Remover código de validação antigo

---

## 🧪 Testar a Integração

### Teste 1: Validação em tempo real

1. Empacotar preço e ver erro aparecer imediatamente ✅
2. Digitar nome muito curto e ver erro ✅
3. Fixar e er desaparecer ✅

### Teste 2: Erro do servidor

1. Simular erro 400 no backend
2. Verificar se apareça em campo específico ✅

### Teste 3: Segurança

1. Digitar: `<script>alert('xss')</script>`
2. Verificar se foi sanitizado ✅

### Teste 4: Formatação

1. Digitar: 1550
2. Ver aparecer como: R$ 15,50 ✅

---

## 💡 Dicas & Truques

### Tipar o Formulário

```tsx
import { FC } from "react";

interface ProdutoFormProps {
  onSuccess?: (id: string) => void;
  initialValues?: typeof initialValues;
}

const ProdutoForm: FC<ProdutoFormProps> = ({ onSuccess, initialValues }) => {
  // ...
};
```

### Reutilizar Configuração

```jsx
const productFormValidators = {
  nome: { validator: validateProductName, validateOnChange: true },
  preco: { validator: validatePrice, validateOnBlur: true },
  // ... compartilhado entre múltiplos forms
};

// Em ProdutoForm.jsx
const { ... } = useFormValidation(initialValues, productFormValidators);
```

### Adicionar Validação de Negócio

```jsx
const onSubmit = async (formValues) => {
  // Validação adicional
  if (formValues.precoVenda <= formValues.precoCompra) {
    setFieldError("precoVenda", "Preço venda deve ser maior que compra");
    return;
  }

  // Continuar...
};
```

### Debug Mode

```jsx
{
  process.env.NODE_ENV === "development" && (
    <div className="bg-yellow-50 p-4 border border-yellow-200 text-xs">
      <pre>{JSON.stringify({ values, errors, touched }, null, 2)}</pre>
    </div>
  );
}
```

---

## 🏁 Próximos Passos

1. **Agora:** Aplicar este padrão a `ProdutoForm.jsx`
2. **Depois:** Aplicar a `FornecedorForm.jsx`
3. **Depois:** Aplicar a `MovimentacaoForm.jsx`
4. **Depois:** Aplicar a `LoginForm.jsx`
5. **Final:** Testar tudo junto

---

## 📚 Arquivos Relacionados

- [VALIDACAO_QUICK_START.md](VALIDACAO_QUICK_START.md) - Quick start
- [VALIDACAO_SISTEMA_COMPLETO.md](VALIDACAO_SISTEMA_COMPLETO.md) - Referência completa
- [BACKEND_INTEGRACAO_VALIDACOES.md](BACKEND_INTEGRACAO_VALIDACOES.md) - Backend
- [TESTES_INTEGRACAO_FRONTEND_BACKEND.md](TESTES_INTEGRACAO_FRONTEND_BACKEND.md) - Testes

---

**Última atualização:** 23 de fevereiro de 2026
