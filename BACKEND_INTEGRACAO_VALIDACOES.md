# 🔗 Integração com Backend - Guia

Guia de como integrar o sistema de validações do BarStock com seu backend.

## 🎯 Visão Geral

O sistema de validações foi projetado para funcionar em 2 camadas:

1. **Frontend** (React) - Validação em tempo real para UX
2. **Backend** (Seu servidor) - Validação final para segurança

```
┌─────────────────────────┐
│  Frontend (React)       │
│  - Validação rápida     │
│  - UX feedback          │
│  - Masks automáticas    │
└────────────┬────────────┘
             │
             ▼
┌─────────────────────────┐
│  API/Backend            │
│  - Validação final      │
│  - Lógica de negócio    │
│  - Segurança            │
└─────────────────────────┘
```

---

## 🔐 Princípio de Segurança

**Nunca confie apenas na validação frontend!**

Sempre repita as validações no backend:

- Usuários podem desabilitar JavaScript
- Requests podem ser forjadas (curl, Postman, etc)
- Dados em trânsito podem ser alterados

---

## 📝 Passo 1: Estrutura de Resposta

Seu backend deve retornar erros estruturados:

### Sucesso (200)

```json
{
  "id": "123",
  "message": "Produto criado com sucesso",
  "data": {
    "id": "123",
    "nome": "Skol 600ml",
    "precoVenda": 5.5
  }
}
```

### Erro de Validação (400)

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "nome": "Nome já existe",
    "precoVenda": "Preço deve ser maior que o de compra",
    "quantidade": "Máximo 999999"
  }
}
```

### Erro Genérico (500)

```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

---

## 🔄 Passo 2: Frontend - Tratamento de Erros

No seu formulário, capture erros do servidor:

```jsx
import { useFormValidation } from "@/hooks/useFormValidation";
import { validateProductForm } from "@/utils/validators";
import FormInput from "@/components/shared/FormInput";

export function ProdutoForm() {
  const [serverError, setServerError] = useState("");

  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    setFieldError,
    shouldShowError,
  } = useFormValidation({ nome: "", precoVenda: "" }, validators);

  const onSubmit = async (formValues) => {
    try {
      // Enviar ao backend
      const response = await api.post("/produtos", formValues);

      // Sucesso
      console.log("Produto criado:", response.data.data);
    } catch (error) {
      // Tratamento de erro
      if (error.response?.data?.errors) {
        // Erros de validação por campo
        const fieldErrors = error.response.data.errors;

        Object.entries(fieldErrors).forEach(([field, message]) => {
          setFieldError(field, message); // Mostrar no campo
        });
      } else if (error.response?.data?.message) {
        // Erro genérico
        setServerError(error.response.data.message);
      } else {
        setServerError("Erro ao salvar. Tente novamente.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {serverError && (
        <div className="text-red-600 bg-red-50 p-3 rounded">{serverError}</div>
      )}

      {/* Campo com erro do servidor */}
      <FormInput
        label="Nome"
        name="nome"
        value={values.nome}
        onChange={handleChange}
        error={shouldShowError("nome") ? errors.nome : undefined}
      />

      <button type="submit">Salvar</button>
    </form>
  );
}
```

---

## 🛡️ Passo 3: Backend - Duplicar Validações

Repita as validações do frontend no backend.

### Exemplo Backend (Node.js + Express)

```javascript
const express = require("express");
const router = express.Router();

// Importar validadores (mesma lógica do front)
const {
  validateProductName,
  validatePrice,
  validateQuantity,
  sanitizeInput,
} = require("./validators");

// POST /api/produtos
router.post("/produtos", async (req, res) => {
  try {
    const { nome, precoVenda, quantidade } = req.body;

    // Erros acumulados
    const errors = {};

    // ============================================
    // Validação (mesma lógica do frontend!)
    // ============================================

    // Nome
    const nameValidation = validateProductName(nome);
    if (!nameValidation.isValid) {
      errors.nome = nameValidation.error;
    }

    // Preço
    const priceValidation = validatePrice(precoVenda);
    if (!priceValidation.isValid) {
      errors.precoVenda = priceValidation.error;
    }

    // Quantidade
    const qtyValidation = validateQuantity(quantidade);
    if (!qtyValidation.isValid) {
      errors.quantidade = qtyValidation.error;
    }

    // Validação de negócio
    if (precoCompra > precoVenda) {
      errors.precoVenda = "Preço de venda deve ser maior que compra";
    }

    // Se há erros, retornar 400
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({
        success: false,
        message: "Erro de validação",
        errors,
      });
    }

    // ============================================
    // Salvar no banco
    // ============================================

    // Sanitizar antes de salvar
    const cleanName = sanitizeInput(nome);

    const produto = await Produto.create({
      nome: cleanName,
      precoVenda: Number(precoVenda),
      quantidade: Number(quantidade),
      estabelecimentoId: req.body.estabelecimentoId,
    });

    // Sucesso
    return res.json({
      success: true,
      message: "Produto criado com sucesso",
      data: produto,
    });
  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return res.status(500).json({
      success: false,
      message: "Erro interno do servidor",
    });
  }
});

module.exports = router;
```

### Exemplo Backend (Python + Django)

```python
from django.http import JsonResponse
from django.views.decorators.http import require_http_methods
import json

from .validators import (
    validate_product_name,
    validate_price,
    validate_quantity,
    sanitize_input
)

@require_http_methods(["POST"])
def create_produto(request):
    try:
        data = json.loads(request.body)
        nome = data.get("nome")
        precoVenda = data.get("precoVenda")
        quantidade = data.get("quantidade")

        # Acumular erros
        errors = {}

        # Validar
        nameValidation = validate_product_name(nome)
        if not nameValidation["isValid"]:
            errors["nome"] = nameValidation["error"]

        priceValidation = validate_price(precoVenda)
        if not priceValidation["isValid"]:
            errors["precoVenda"] = priceValidation["error"]

        qtyValidation = validate_quantity(quantidade)
        if not qtyValidation["isValid"]:
            errors["quantidade"] = qtyValidation["error"]

        # Retornar erros se houver
        if errors:
            return JsonResponse({
                "success": False,
                "message": "Erro de validação",
                "errors": errors
            }, status=400)

        # Sanitizar e salvar
        cleanName = sanitize_input(nome)
        produto = Produto.objects.create(
            nome=cleanName,
            precoVenda=float(precoVenda),
            quantidade=int(quantidade)
        )

        return JsonResponse({
            "success": True,
            "message": "Produto criado com sucesso",
            "data": product.to_dict()
        })

    except Exception as e:
        return JsonResponse({
            "success": False,
            "message": "Erro interno"
        }, status=500)
```

---

## 📋 Validadores Backend vs Frontend

| Campo    | Frontend           | Backend                       |
| -------- | ------------------ | ----------------------------- |
| Nome     | 3-100 chars        | 3-100 chars + check duplicata |
| Email    | Regex básico       | Regex + check duplicata       |
| Preço    | > 0                | > 0 + > preço compra          |
| Telefone | 10-11 dígitos      | 10-11 dígitos                 |
| CNPJ     | Dígito verificador | Dígito verificador            |

**Backend sempre deve validar mais!**

---

## 🔒 Segurança de API

### 1. Sempre Validar Entrada

```python
# ✅ BOM
errors = validate_all_fields(request.data)
if errors:
    return bad_request(errors)

# ❌ NUNCA
# Confiar apenas no frontend
```

### 2. Sanitizar Antes de Salvar

```python
# ✅ BOM
clean_name = sanitize_input(nome)
produto.nome = clean_name

# ❌ NUNCA
produto.nome = request.data.get("nome")  # Sem sanitizar
```

### 3. Rate Limiting

```python
# ✅ Proteja endpoints contra brute force
@rate_limit(requests=10, per=60)  # 10 requests por minuto
def create_produto(request):
    pass
```

### 4. Autenticação e Autorização

```python
# ✅ Sempre verificar permissões
@require_http_methods(["POST"])
def create_produto(request):
    if not request.user.is_authenticated:
        return unauthorized()

    if request.user.estabelecimento != produto.estabelecimento:
        return forbidden()
```

---

## 🚨 Erros Comuns

### ❌ Erro 1: Confiar Apenas no Frontend

```python
# ERRADO
# Backend não valida nada, confia no frontend
def create_produto(request):
    produto = Produto.objects.create(**request.data)
```

**Solução:** Sempre validar no backend também!

### ❌ Erro 2: Não Tratar Exceções

```python
# ERRADO
def create_produto(request):
    produto = Produto.objects.create(**request.data)  # Pode falhar
    return json(produto)  # E expor erro?
```

**Solução:** Usar try/except sempre!

### ❌ Erro 3: Retornar Erros Inconsistentes

```python
# ERRADO - Às vezes retorna array, às vezes dict
return {"error": "algo"}  # vs
return {"errors": {"field": "algo"}}
```

**Solução:** Usar structure consistente (veja exemplo acima)

### ❌ Erro 4: Não Sanitizar

```python
# ERRADO
produto.nome = request.data.get("nome")  # Pode ter HTML!
```

**Solução:** Sempre sanitizar!

---

## 📤 API - Exemplo Completo

### Request

```bash
curl -X POST http://localhost:3000/api/produtos \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer token" \
  -d '{
    "nome": "Skol 600ml",
    "categoria": "Cerveja",
    "precoCompra": 3.50,
    "precoVenda": 5.50,
    "quantidade": 100,
    "estabelecimentoId": "123"
  }'
```

### Response (Sucesso)

```json
{
  "success": true,
  "message": "Produto criado com sucesso",
  "data": {
    "id": "prod_123",
    "nome": "Skol 600ml",
    "categoria": "Cerveja",
    "precoCompra": 3.5,
    "precoVenda": 5.5,
    "quantidade": 100,
    "createdAt": "2024-02-23T14:30:00Z"
  }
}
```

### Response (Erro Validação)

```json
{
  "success": false,
  "message": "Erro de validação",
  "errors": {
    "nome": "Nome deve ter no mínimo 3 caracteres",
    "quantidade": "Quantidade máxima é 999999"
  }
}
```

### Response (Erro Servidor)

```json
{
  "success": false,
  "message": "Erro interno do servidor"
}
```

---

## 🔄 Ciclo Completo de Validação

```
1. FRONTEND (onChange)
   └─> Validação em tempo real
       └─> Mostrar erro visualmente
           └─> Desabilitar submit

2. FRONTEND (onSubmit)
   └─> Validação final
       └─> Se OK → enviar ao backend
           └─ Se erro → permanecer no form

3. BACKEND (Recebimento)
   └─> Validar novamente (!)
       └─> Se erro → retornar 400 com erros
           └─ Se OK → processar

4. BACKEND (Processamento)
   └─> Sanitizar dados
       └─> Verificar regras de negócio
           └─> Salvar no banco

5. FRONTEND (Resposta)
   └─> Se sucesso → redirecionar/fechar
       └─ Se erro → mostrar erro em campo específico
```

---

## 📚 Arquivo de Validadores Backend

Para facilitar, você pode usar o mesmo arquivo que o frontend:

### JavaScript (Node.js)

```javascript
// shared/validators.js
module.exports = {
  validateProductName: (value) => {
    if (!value || value.length < 3) {
      return { isValid: false, error: "Mínimo 3 caracteres" };
    }
    return { isValid: true };
  },
  // ... outros validadores
};
```

Usar no backend:

```javascript
const { validateProductName } = require("../shared/validators");

const result = validateProductName(nome);
if (!result.isValid) {
  errors.nome = result.error;
}
```

### Python

```python
# shared/validators.py
def validate_product_name(value):
    if not value or len(value) < 3:
        return {
            "isValid": False,
            "error": "Mínimo 3 caracteres"
        }
    return {"isValid": True}
```

---

## ✅ Checklist de Segurança

- [ ] Frontend valida (UX)
- [ ] Backend valida (segurança) ← **Crítico!**
- [ ] Backend sanitiza entrada
- [ ] Tratamento de exceções em todo lugar
- [ ] Rate limiting em endpoints
- [ ] Autenticação/Autorização
- [ ] Logs de erros
- [ ] Sem dados sensíveis em logs
- [ ] CORS configurado corretamente
- [ ] HTTPS em produção

---

## 🚀 Deployment

### Antes de Deploy

- [ ] Testar todos os validadores
- [ ] Testar erros do servidor no frontend
- [ ] Verificar tratamento de exceções
- [ ] Verificar logs
- [ ] Testar rate limiting
- [ ] Testar autenticação

### Em Produção

- [ ] Monitorar erros
- [ ] Adicionar alertas para erros críticos
- [ ] Ter plano de rollback
- [ ] Documentar mudanças de API

---

## 📞 FAQ Backend

### Como reutilizar validadores do Frontend?

Escreva validadores em JavaScript/Python que compartilhem a mesma lógica between frontend e backend.

### Preciso duplicar todo validador?

Sim! É melhor ter código duplicado e seguro do que código compartilhado e inseguro.

### E se o usuário desabilitar JavaScript?

O backend valida tudo de novo. O frontend é apenas para UX.

### Como versionar a API?

Use `/api/v1/`, `/api/v2/`, etc. Assim pode manter compatibilidade.

---

## 🎓 Recursos

- [OWASP: Input Validation](https://cheatsheetseries.owasp.org/cheatsheets/Input_Validation_Cheat_Sheet.html)
- [Backend Security](https://owasp.org/www-project-top-ten/)
- [API Security](https://owasp.org/www-project-api-security/)

---

**Última atualização:** 23 de fevereiro de 2026
