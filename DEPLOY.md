# 🚀 Guia Rápido de Deploy

## Opção 1: Deploy Rápido (Recomendado)

### Backend - Render.com (Grátis)

1. Acesse: https://render.com
2. Crie uma conta (pode usar GitHub)
3. Clique em "New +" → "Web Service"
4. Conecte ao GitHub e selecione seu repositório
5. Configure:
   ```
   Name: dashboard-pedidos-api
   Environment: Node
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```
6. Clique em "Create Web Service"
7. **IMPORTANTE**: Copie a URL gerada (ex: https://dashboard-pedidos-api.onrender.com)

### Frontend - Vercel (Grátis)

1. Antes de fazer deploy, atualize a URL da API:
   
   Abra `frontend/src/App.js` e altere a linha:
   ```javascript
   const API_URL = 'https://SUA-URL-DO-RENDER.onrender.com';
   ```

2. Instale o Vercel CLI:
   ```bash
   npm install -g vercel
   ```

3. Navegue até a pasta frontend:
   ```bash
   cd frontend
   ```

4. Faça login no Vercel:
   ```bash
   vercel login
   ```

5. Deploy:
   ```bash
   vercel --prod
   ```

6. Siga as instruções no terminal e pronto! 🎉

## Opção 2: Deploy Manual Netlify

### Backend - Railway.app (Grátis)

1. Acesse: https://railway.app
2. Faça login com GitHub
3. Clique em "New Project" → "Deploy from GitHub repo"
4. Selecione seu repositório
5. Configure:
   ```
   Root Directory: backend
   Start Command: npm start
   ```

### Frontend - Netlify (Grátis)

1. Atualize a URL da API no `frontend/src/App.js`
2. Faça o build:
   ```bash
   cd frontend
   npm run build
   ```
3. Acesse: https://netlify.com
4. Arraste a pasta `build` para fazer deploy
5. Pronto! 🎉

## 🔑 Variáveis de Ambiente

### No Render/Railway (Backend)
Não precisa configurar nada, o PORT é configurado automaticamente.

### No Vercel/Netlify (Frontend)
Adicione a variável:
```
REACT_APP_API_URL = https://sua-url-do-backend.com
```

## ✅ Checklist Pós-Deploy

- [ ] Backend está rodando? (Teste: https://sua-url-backend/api/check-data)
- [ ] Frontend está acessível?
- [ ] Consegue fazer upload de arquivo?
- [ ] Dados persistem após refresh?

## 🆘 Problemas Comuns

**Erro CORS**: Certifique-se que o backend tem `cors` configurado.

**Upload não funciona**: Verifique se a URL da API está correta no frontend.

**Dados não persistem**: Certifique-se que o backend tem permissão de escrita para criar o arquivo .db.

## 📞 Precisa de Ajuda?

- Render Docs: https://render.com/docs
- Vercel Docs: https://vercel.com/docs
- Netlify Docs: https://docs.netlify.com

---

**Dica**: Para deploy mais profissional, considere usar:
- Backend: AWS EC2 ou DigitalOcean
- Frontend: Cloudflare Pages
- Banco: PostgreSQL no Render ou Supabase
