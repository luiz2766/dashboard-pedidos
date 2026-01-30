# Dashboard de Pedidos - Sistema Completo

Sistema completo de dashboard para análise de pedidos regionais com backend Node.js, frontend React e banco de dados SQLite.

## 🚀 Funcionalidades

- ✅ Upload de arquivos Excel (.xls, .xlsx)
- ✅ Persistência de dados em banco SQLite
- ✅ Dashboard interativo com estatísticas em tempo real
- ✅ Rankings por valor e peso
- ✅ Filtros por cliente e cidade
- ✅ Tabela completa com todos os pedidos
- ✅ Design responsivo e profissional

## 📋 Pré-requisitos

- Node.js (versão 14 ou superior)
- npm ou yarn

## 🔧 Instalação

### 1. Clone o repositório
```bash
git clone <seu-repositorio>
cd dashboard-pedidos
```

### 2. Instalar dependências do Backend
```bash
cd backend
npm install
```

### 3. Instalar dependências do Frontend
```bash
cd ../frontend
npm install
```

## ▶️ Executar Localmente

### Opção 1: Executar Backend e Frontend separadamente

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```
O backend estará rodando em: http://localhost:3001

**Terminal 2 - Frontend:**
```bash
cd frontend
npm start
```
O frontend abrirá automaticamente em: http://localhost:3000

### Opção 2: Executar com um comando (após configuração)
Você pode adicionar um script no package.json raiz para rodar ambos simultaneamente.

## 📁 Estrutura do Projeto

```
dashboard-pedidos/
├── backend/
│   ├── server.js          # Servidor Express
│   ├── package.json
│   ├── pedidos.db         # Banco SQLite (gerado automaticamente)
│   └── uploads/           # Pasta temporária para uploads
│
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── App.js         # Componente principal
│   │   ├── App.css        # Estilos
│   │   ├── index.js
│   │   └── index.css
│   └── package.json
│
└── README.md
```

## 📊 Formato do Arquivo Excel

O arquivo deve conter as seguintes colunas:
- PEDIDOS
- DATA DO PEDIDO
- COD CLIENTE
- RAZÃO SOCIAL
- CEP
- ENDERECO
- BAIRRO
- Cidades
- ESTADO
- PESO PEDIDO
- VALOR

## 🚀 Deploy para Produção

### Deploy do Backend (Render, Railway, ou Heroku)

#### Usando Render.com (Recomendado - Grátis):

1. Crie uma conta em [render.com](https://render.com)
2. Clique em "New +" → "Web Service"
3. Conecte seu repositório GitHub
4. Configure:
   - **Name**: dashboard-pedidos-api
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Root Directory**: deixe vazio
5. Clique em "Create Web Service"
6. Anote a URL gerada (ex: https://dashboard-pedidos-api.onrender.com)

### Deploy do Frontend (Vercel ou Netlify)

#### Usando Vercel (Recomendado):

1. Instale o Vercel CLI:
```bash
npm install -g vercel
```

2. Entre na pasta do frontend:
```bash
cd frontend
```

3. Atualize a URL da API no arquivo src/App.js:
```javascript
const API_URL = 'https://sua-url-do-backend.onrender.com';
```

4. Faça o build:
```bash
npm run build
```

5. Deploy:
```bash
vercel --prod
```

#### Usando Netlify:

1. Faça login em [netlify.com](https://netlify.com)
2. Clique em "Add new site" → "Deploy manually"
3. Arraste a pasta `frontend/build` para a área de upload
4. Configure a variável de ambiente `REACT_APP_API_URL` com a URL do seu backend

## 🔐 Variáveis de Ambiente

### Backend (.env)
```env
PORT=3001
```

### Frontend (.env.production)
```env
REACT_APP_API_URL=https://sua-url-do-backend.onrender.com
```

## 📱 Como Usar

1. Acesse a aplicação
2. Se não houver dados, clique em "Importar Arquivo Excel"
3. Selecione um arquivo .xls ou .xlsx com o formato correto
4. Aguarde o processamento
5. Os dados serão exibidos no dashboard
6. Use os filtros para buscar pedidos específicos
7. Para atualizar os dados, clique em "Atualizar Dados" no cabeçalho

## 🛠️ Tecnologias Utilizadas

### Backend
- Node.js
- Express.js
- SQLite3
- Multer (upload de arquivos)
- XLSX (leitura de Excel)

### Frontend
- React 18
- Axios
- CSS3 com Grid e Flexbox

## 📞 Suporte

Para dúvidas ou problemas, abra uma issue no GitHub.

## 📄 Licença

MIT License
