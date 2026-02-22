# Configuração OAuth Google - Guia Completo

## ✅ Implementação Frontend (Concluída)

### Arquivos Modificados:

- ✅ `.env.local` - Client ID configurado
- ✅ `src/main.jsx` - GoogleOAuthProvider adicionado
- ✅ `src/pages/LoginV2.jsx` - Botão OAuth funcional
- ✅ `src/lib/AuthContext.jsx` - Função loginWithGoogle adicionada
- ✅ `src/services/auth.service.ts` - Método loginWithGoogle criado

### Client ID Configurado:

```
121871816349-h67mqvm49dnlnssngqn4ae07v5e0b59o.apps.googleusercontent.com
```

---

## 🔧 URIs de Redirecionamento no Google Cloud Console

### Desenvolvimento Local:

```
http://localhost:5173
http://localhost:5173/login-v2
```

### Produção:

```
https://seudominio.com
https://seudominio.com/login-v2
```

**Importante:** Configure essas URIs no [Google Cloud Console](https://console.cloud.google.com) em:

- APIs & Services → Credentials → Seu OAuth 2.0 Client ID → Authorized JavaScript origins e Authorized redirect URIs

---

## 🚨 Implementação Necessária no Backend

O backend precisa criar a seguinte rota para processar o login OAuth:

### POST `/auth/google`

**Request Body:**

```json
{
  "credential": "{\"sub\":\"123456789\",\"email\":\"user@gmail.com\",\"name\":\"User Name\",\"picture\":\"https://...\"}"
}
```

**Fluxo de Implementação:**

1. **Validar o token/credential do Google**
2. **Extrair informações do usuário:**
   - `sub` (Google User ID)
   - `email`
   - `name`
   - `picture` (URL da foto)

3. **Verificar se o usuário existe:**
   - Se existe: fazer login e retornar token
   - Se não existe: criar novo usuário e estabelecimento automaticamente

4. **Response esperada:**

```json
{
  "user": {
    "id": "uuid",
    "name": "User Name",
    "email": "user@gmail.com",
    "role": "admin",
    "estabelecimentoId": "uuid",
    "estabelecimentoNome": "Nome do Estabelecimento"
  },
  "token": "jwt_token_here"
}
```

### Exemplo de Implementação (Node.js/Express):

```javascript
router.post("/auth/google", async (req, res) => {
  try {
    const { credential } = req.body;
    const userInfo = JSON.parse(credential);

    // Buscar ou criar usuário
    let user = await User.findOne({
      where: { email: userInfo.email },
    });

    if (!user) {
      // Criar estabelecimento
      const estabelecimento = await Estabelecimento.create({
        nome: `Estabelecimento de ${userInfo.name}`,
      });

      // Criar usuário
      user = await User.create({
        nome: userInfo.name,
        email: userInfo.email,
        role: "admin",
        estabelecimentoId: estabelecimento.id,
        googleId: userInfo.sub,
        // Não precisa de senha para OAuth
      });
    }

    // Gerar token JWT
    const token = jwt.sign(
      {
        userId: user.id,
        estabelecimentoId: user.estabelecimentoId,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.json({
      user: {
        id: user.id,
        name: user.nome,
        email: user.email,
        role: user.role,
        estabelecimentoId: user.estabelecimentoId,
        estabelecimentoNome: estabelecimento?.nome,
      },
      token,
    });
  } catch (error) {
    console.error("Erro no login Google:", error);
    res.status(500).json({
      message: "Erro ao autenticar com Google",
    });
  }
});
```

---

## 📝 Checklist de Deploy

### Frontend:

- [x] Client ID configurado no `.env.local`
- [x] GoogleOAuthProvider no `main.jsx`
- [x] Botão OAuth funcional
- [ ] Adicionar `VITE_GOOGLE_CLIENT_ID` no ambiente de produção

### Backend:

- [ ] Rota `POST /auth/google` implementada
- [ ] Validação do token do Google
- [ ] Criação automática de usuário e estabelecimento
- [ ] Geração de JWT token
- [ ] Testes da rota

### Google Cloud Console:

- [ ] URIs de produção adicionadas
- [ ] Client ID copiado para variável de ambiente de produção

---

## 🔒 Variáveis de Ambiente

### Frontend (.env.local ou ambiente de produção):

```bash
VITE_API_URL=http://localhost:3000
VITE_GOOGLE_CLIENT_ID=121871816349-h67mqvm49dnlnssngqn4ae07v5e0b59o.apps.googleusercontent.com
```

### Backend (.env):

```bash
JWT_SECRET=sua_chave_secreta_aqui
DATABASE_URL=sua_url_do_banco
```

---

## 🧪 Como Testar

1. **Inicie o backend** (com a rota `/auth/google` implementada)
2. **Inicie o frontend:** `npm run dev`
3. **Acesse:** `http://localhost:5173/login-v2`
4. **Clique no botão "Google"**
5. **Selecione uma conta Google**
6. **Você deve ser redirecionado para o dashboard**

---

## 🐛 Troubleshooting

### Erro: "redirect_uri_mismatch"

- Verifique se as URIs estão configuradas corretamente no Google Cloud Console
- A URI deve ser exatamente igual (incluindo protocolo http/https)

### Erro: "Invalid Client ID"

- Verifique se o VITE_GOOGLE_CLIENT_ID está correto
- Reinicie o servidor de desenvolvimento após alterar .env

### Erro 401/403 do backend

- Verifique se a rota `/auth/google` existe no backend
- Verifique logs do servidor backend

### Botão não faz nada

- Abra o Console do navegador (F12) para ver erros JavaScript
- Verifique se o GoogleOAuthProvider está envolvendo o App

---

## 📚 Recursos

- [Google OAuth 2.0 Documentation](https://developers.google.com/identity/protocols/oauth2)
- [@react-oauth/google Documentation](https://www.npmjs.com/package/@react-oauth/google)
- [JWT.io](https://jwt.io/) - Para debugar tokens JWT
