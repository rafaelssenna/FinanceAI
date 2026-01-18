# FinanceAI

Aplicativo de controle financeiro pessoal com inteligencia artificial.

## Stack

### Frontend
- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- shadcn/ui
- React Query
- Zustand

### Backend
- NestJS
- Fastify
- Prisma
- PostgreSQL
- JWT Authentication
- Google Gemini AI

## Estrutura

```
financeai/
├── frontend/     # Next.js app (Vercel)
└── backend/      # NestJS API (Railway)
```

## Deploy

### Frontend (Vercel)
1. Conecte o repositorio ao Vercel
2. Configure o Root Directory como `frontend`
3. Adicione a variavel de ambiente:
   - `NEXT_PUBLIC_API_URL`: URL do backend

### Backend (Railway)
1. Crie um novo projeto no Railway
2. Adicione um PostgreSQL database
3. Configure o Root Directory como `backend`
4. Adicione as variaveis de ambiente:
   - `DATABASE_URL`: URL do PostgreSQL (Railway fornece automaticamente)
   - `JWT_SECRET`: Chave secreta para JWT
   - `FRONTEND_URL`: URL do frontend na Vercel
   - `GEMINI_API_KEY`: Chave da API do Google Gemini

## Desenvolvimento Local

### Backend
```bash
cd backend
npm install
cp .env.example .env
# Configure o .env
npx prisma migrate dev
npm run start:dev
```

### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
# Configure o .env.local
npm run dev
```
