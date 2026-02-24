# 📖 Índice de Validações - Guia de Navegação

Índice completo de todas as funcionalidades implementadas no sistema de validações do BarStock.

## 🔍 Como Navegar

### Por Tipo de Funcionalidade

#### 🔐 Segurança

- `sanitizeInput()` - Remove caracteres perigosos `src/utils/validators.ts:L27`
- `containsMaliciousPattern()` - Detecta XSS/injeção `src/utils/validators.ts:L43`
- `validateSafeInput()` - Validação completa de segurança `src/utils/validators.ts:L58`

#### 📦 Produto

- `validateProductName()` - Nome do produto `src/utils/validators.ts:L89`
- `validateProductDescription()` - Descrição do produto `src/utils/validators.ts:L127`
- `validatePrice()` - Preço em moeda `src/utils/validators.ts:L155`
- `validateQuantity()` - Quantidade em estoque `src/utils/validators.ts:L184`
- `validateProductForm()` - Validação completa `src/utils/validators.ts:L534`

#### 🚚 Fornecedor

- `validateSupplierName()` - Nome do fornecedor `src/utils/validators.ts:L289`
- `validatePhoneBR()` - Telefone brasileiro `src/utils/validators.ts:L219`
- `validateCNPJ()` - CNPJ com dígito verificador `src/utils/validators.ts:L249`
- `validateSupplierForm()` - Validação completa `src/utils/validators.ts:L574`

#### 👤 Usuário

- `validateEmail()` - Email robusto `src/utils/validators.ts:L327`
- `validatePassword()` - Senha forte `src/utils/validators.ts:L365`
- `validateUsername()` - Nome de usuário `src/utils/validators.ts:L420`
- `validateUserForm()` - Validação completa `src/utils/validators.ts:L614`

#### 🔄 Movimentação

- `validateMovementObservation()` - Observação `src/utils/validators.ts:L478`
- `validateMovementType()` - Tipo (entrada/saída/ajuste) `src/utils/validators.ts:L502`

---

## 💰 Formatadores

### Moeda

- `formatCurrencyBR(value)` - Formata como "R$ 12,50" `src/utils/formatters.ts:L20`
- `parseCurrencyBR(value)` - Parse para número `src/utils/formatters.ts:L39`
- `formatCurrencyInput(value)` - Formatação em tempo real `src/utils/formatters.ts:L53`

### Telefone

- `formatPhoneBR(value)` - Formata como "(XX) XXXXX-XXXX" `src/utils/formatters.ts:L78`
- `parsePhoneBR(value)` - Parse para dígitos `src/utils/formatters.ts:L115`

### CNPJ

- `formatCNPJ(value)` - Formata como "XX.XXX.XXX/XXXX-XX" `src/utils/formatters.ts:L131`
- `parseCNPJ(value)` - Parse para dígitos `src/utils/formatters.ts:L175`

### Quantidade

- `formatQuantity(value)` - Formata com separador "1.234" `src/utils/formatters.ts:L191`
- `parseQuantity(value)` - Parse para número `src/utils/formatters.ts:L207`
- `formatQuantityInput(value)` - Validação em tempo real `src/utils/formatters.ts:L219`

### Texto

- `truncateText(text, maxLength)` - Trunca com "..." `src/utils/formatters.ts:L243`
- `normalizeText(text)` - Remove espaços extras `src/utils/formatters.ts:L260`
- `capitalize(text)` - Primeira letra maiúscula `src/utils/formatters.ts:L463`
- `removeAccents(text)` - Remove acentos `src/utils/formatters.ts:L489`

### Data/Hora

- `formatDateBR(date)` - Formata como "DD/MM/YYYY" `src/utils/formatters.ts:L277`
- `formatDateTimeBR(date)` - Com hora "DD/MM/YYYY HH:mm" `src/utils/formatters.ts:L299`
- `formatTimeBR(date)` - Apenas hora "HH:mm" `src/utils/formatters.ts:L321`
- `formatRelativeTime(date)` - Tempo relativo "há 2 minutos" `src/utils/formatters.ts:L337`

### CPF

- `formatCPF(value)` - Formata como "XXX.XXX.XXX-XX" `src/utils/formatters.ts:L379`
- `parseCPF(value)` - Parse para dígitos `src/utils/formatters.ts:L413`

---

## 🎣 Hooks

### useFormValidation

`src/hooks/useFormValidation.ts:L20`

```typescript
const {
  values,
  errors,
  touched, // Estado
  handleChange,
  handleBlur,
  handleSubmit, // Handlers
  setFieldValue,
  setFieldError, // Setters
  isValid,
  shouldShowError, // Queries
  resetValues,
  clearErrors, // Limpadores
  validateField,
  validateAll, // Validação manual
} = useFormValidation(initialValues, validators);
```

### useSimpleFormValidation

`src/hooks/useFormValidation.ts:L407`

Versão simplificada para formulários básicos.

---

## 🎨 Componentes

### FormInput

`src/components/shared/FormInput.jsx`

Input genérico com validação integrada.

```jsx
<FormInput
  label="Nome"
  name="nome"
  value={values.nome}
  onChange={handleChange}
  error={shouldShowError("nome") ? errors.nome : undefined}
  required={true}
  maxLength={100}
  showCharCount={true}
/>
```

### FormCurrencyInput

`src/components/shared/FormCurrencyInput.jsx`

Input especializado para moeda com formatação automática.

```jsx
<FormCurrencyInput
  label="Preço"
  name="preco"
  value={values.preco}
  onChange={handleChange}
  minimum={0}
  maximum={999999.99}
/>
```

### FormPhoneInput

`src/components/shared/FormPhoneInput.jsx`

Input com máscara automática para telefone.

```jsx
<FormPhoneInput
  label="Telefone"
  name="telefone"
  value={values.telefone}
  onChange={handleChange}
/>
```

### FormCNPJInput

`src/components/shared/FormCNPJInput.jsx`

Input com máscara e validação de CNPJ.

```jsx
<FormCNPJInput
  label="CNPJ"
  name="cnpj"
  value={values.cnpj}
  onChange={handleChange}
/>
```

---

## 📝 Formulários Exemplo

### ProdutoFormV2

`src/components/produtos/ProdutoFormV2.jsx`

Formulário completo de produto com validações robustas.

Características:

- ✅ Validação em tempo real
- ✅ Formatação de moeda automática
- ✅ Contador de caracteres na descrição
- ✅ Mensagens de sucesso/erro
- ✅ Sanitização de input

### FornecedorFormV2

`src/components/fornecedores/FornecedorFormV2.jsx`

Formulário de fornecedor com validações.

Características:

- ✅ Validação de telefone com máscara
- ✅ Validação de CNPJ com dígito verificador
- ✅ Validação de email
- ✅ Tratamento de erros do servidor
- ✅ Feedback visual

### MovimentacaoFormV2

`src/components/produtos/MovimentacaoFormV2.jsx`

Formulário de movimentação de estoque.

Características:

- ✅ Validação de tipo
- ✅ Validação de quantidade
- ✅ Sanitização de observação
- ✅ Callback de sucesso

### SignUpFormV2

`src/pages/SignUpFormV2.jsx`

Formulário de cadastro de usuário.

Características:

- ✅ Validação de email robusto
- ✅ Validação de senha forte
- ✅ Toggle show/hide password
- ✅ Confirmação de senha
- ✅ Validação de username

---

## 🧪 Testes

### validators.test.ts

`src/utils/validators.test.ts`

Exemplos de testes unitários para:

- Segurança (sanitização, detecção de XSS)
- Produto (nome, descrição, preço, quantidade)
- Fornecedor (telefone, CNPJ, nome)
- Usuário (email, senha, username)
- Movimentação (tipo, observação)
- Integração (formulários completos)

---

## 📚 Documentação

### VALIDACAO_SISTEMA_COMPLETO.md

Documentação técnica completa com:

- Visão geral
- Cada validador explicado
- Cada formatador explicado
- Como usar o hook
- Exemplos completos
- Boas práticas
- Integração com backend

### VALIDACAO_QUICK_START.md

Guia rápido com:

- Imports essenciais
- Exemplo simples
- Inputs especializados
- Validação simples
- Formatos dados
- Checklist

### VALIDACAO_IMPLEMENTADO.md

Resumo final com:

- Tudo que foi criado
- Estrutura
- Como usar
- Próximas integrações
- Status

### VALIDACAO_SUMARIO.md

Sumário visual com:

- Arquivos criados
- Estatísticas
- Funcionalidades
- Checklist
- Próximos passos

---

## 🎯 Como Usar por Caso

### Caso 1: Criar Novo Formulário

1. Ler: `VALIDACAO_QUICK_START.md`
2. Copiar padrão de `ProdutoFormV2.jsx`
3. Adaptar validadores
4. Usar componentes `FormInput*`
5. Pronto!

### Caso 2: Adicionar Validação a Campo Existente

1. Importar validador de `src/utils/validators`
2. Importar hook `useFormValidation`
3. Adicionar campo aos validators
4. Envolver input com validação
5. Pronto!

### Caso 3: Formatar Dados Para Exibição

1. Importar formatador de `src/utils/formatters`
2. Chamar função: `formatCurrencyBR(value)`
3. Usar resultado
4. Pronto!

### Caso 4: Testar Validador

1. Abrir `src/utils/validators.test.ts`
2. Ver exemplo do teste
3. Copiar padrão
4. Rodar: `npm run test`
5. Pronto!

---

## 🔗 Links Rápidos

### Imports

```typescript
// Validadores
import { validateProductName, validateEmail } from "@/utils/validators";

// Formatadores
import { formatCurrencyBR, formatPhoneBR } from "@/utils/formatters";

// Hook
import { useFormValidation } from "@/hooks/useFormValidation";

// Componentes
import FormInput from "@/components/shared/FormInput";
import FormCurrencyInput from "@/components/shared/FormCurrencyInput";
import FormPhoneInput from "@/components/shared/FormPhoneInput";
import FormCNPJInput from "@/components/shared/FormCNPJInput";
```

---

## 📋 Checklist Rápido

### Novo Formulário

- [ ] Copiar estrutura de `ProdutoFormV2.jsx`
- [ ] Importar validadores específicos
- [ ] Usar `useFormValidation` com os validadores
- [ ] Trocar `FormInput` por especializados se necessário
- [ ] Testar validação (onChange e submit)
- [ ] Testar com dados maliciosos

### Novo Campo

- [ ] Escolher validador apropriado
- [ ] Importar e adicionar ao validators map
- [ ] Usar `FormInput` ou componente especializado
- [ ] Testar validação

### Novo Validador

- [ ] Criar função em `src/utils/validators.ts`
- [ ] Seguir padrão de retorno: `{ isValid, error? }`
- [ ] Exportar em `src/utils/index.ts`
- [ ] Adicionar teste em `validators.test.ts`

---

## 🎓 Nível de Dificuldade

| Tarefa                   | Nível      | Tempo |
| ------------------------ | ---------- | ----- |
| Usar FormInput existente | 🟢 Fácil   | 5min  |
| Criar novo formulário    | 🟡 Médio   | 30min |
| Adicionar novo validador | 🟡 Médio   | 15min |
| Customizar validador     | 🔴 Difícil | 30min |
| Integrar com backend     | 🔴 Difícil | 1h    |

---

## 🚀 Próximas Funcionalidades

- [ ] Integrar DOMPurify
- [ ] Validação assíncrona
- [ ] Suporte a i18n
- [ ] Testes de integração
- [ ] CI/CD com testes
- [ ] Visual de força de senha

---

**Última atualização:** 23 de fevereiro de 2026  
**Status:** ✅ Completo e pronto para produção
