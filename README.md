# BarberSaaS - Sistema de Gestão Multi-tenant para Barbearias

O BarberSaaS é uma plataforma SaaS de agendamento e gestão voltada para barbearias. A aplicação utiliza arquitetura multi-tenant: cada barbearia possui sua própria URL pública de agendamento (baseada no nome), painel administrativo, gestão de clientes e serviços, controle financeiro e fluxo de assinatura B2B.

**Aplicação em produção:** [BarberSaaS](https://saa-s-barbearia-3i7d-oncps2y38-kayamerlins-projects.vercel.app/)

---

## Tecnologias Utilizadas

### Frontend

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS** (estilização)
- **Zustand** (estado global: usuário logado, nome da barbearia, logo, status da assinatura)
- **Axios** (consumo da API com interceptors para JWT e redirecionamento em caso de assinatura pendente)
- **Recharts** (gráficos no dashboard)
- **Plus Jakarta Sans** (tipografia)

### Backend

- **Node.js** e **Express 5**
- **Prisma 7** (ORM e migrações; configuração via `prisma.config.ts` para URL do banco)
- **PostgreSQL** (banco de dados)
- **JSON Web Token (JWT)** para autenticação e proteção de rotas
- **Zod** (validação de payloads)
- **Multer** (configurado; upload de logo em produção foi substituído por Base64 por limitação serverless)
- **dotenv** e **pg** / **@prisma/adapter-pg** para conexão ao banco

### Infraestrutura

- **Vercel** (hospedagem do frontend e do backend em projetos separados)
- **Neon.tech** (PostgreSQL serverless)

---

## Funcionalidades Principais

- **Landing page:** Seções Início, Produto e Contato com scroll suave; links para cadastro e login.
- **Cadastro e login:** Criação de barbearia (tenant) com usuário e login com JWT.
- **Painel administrativo:** Dashboard com resumo do dia, agendamentos, serviços, clientes, financeiro e configurações.
- **Configurações da barbearia:** Nome, logo (Base64), horário de abertura e fechamento; link público de agendamento para enviar aos clientes (copiar para área de transferência).
- **Página pública de agendamento:** URL única por barbearia (`/agendar/{slug}`). Cliente escolhe serviço, data, horário (motor de horários baseado em abertura/fechamento e agendamentos existentes), informa nome e telefone e gera PIX simulado para pagamento.
- **Financeiro (B2C):** Listagem de transações e simulação de confirmação de PIX via webhook.
- **Assinatura B2B (paywall):** Status e vencimento no tenant; geração de PIX de assinatura; middleware que bloqueia acesso a rotas protegidas quando a assinatura está inativa; webhook para simular confirmação de pagamento da assinatura.
- **Auditoria no banco:** Trigger em PL/pgSQL que registra alterações na tabela de transações em uma tabela de log de auditoria.

---

## Decisões Técnicas

### Auditoria via trigger no PostgreSQL

Foi implementada uma trigger em SQL (migração Prisma) que dispara em `AFTER UPDATE` na tabela de transações e grava o registro na tabela de auditoria. Isso centraliza o histórico de mudanças no próprio banco, sem depender apenas da aplicação.

### Compatibilidade com ambiente serverless (Vercel)

O sistema de arquivos na Vercel é somente leitura. Para evitar erro 500 em upload de logo, o fluxo foi alterado: a imagem é convertida para Base64 no frontend (FileReader) e o valor é enviado no corpo do `PUT /configuracoes` e persistido no campo `logoUrl` do tenant. O limite de body no Express foi aumentado para 10MB; o frontend mantém validação de 2MB para não ultrapassar o limite da Vercel (4,5MB).

### CORS e variável FRONTEND_URL

O backend usa `process.env.FRONTEND_URL` como origem permitida no CORS. Em produção, é necessário configurar essa variável no projeto da API na Vercel com a URL do frontend para que as requisições do navegador sejam aceitas.

### Dois projetos na Vercel (monorepo)

- **Backend:** Root Directory definido como `backend`. O `backend` contém `server.js`, `vercel.json`, `package.json`, `prisma` e `prisma.config.ts`, permitindo deploy da API como serverless function.
- **Frontend:** Root Directory definido como `frontend`, com build e deploy padrão do Next.js.

O `vercel.json` está apenas dentro de `backend` para não interferir no deploy do frontend.

---

## Estrutura do Repositório

```
.
├── backend/                 # API (deploy Vercel com Root Directory = backend)
│   ├── prisma/
│   ├── src/
│   ├── server.js
│   ├── vercel.json
│   ├── package.json
│   └── prisma.config.ts
├── frontend/                 # Next.js (deploy Vercel com Root Directory = frontend)
│   ├── app/
│   ├── components/
│   ├── lib/
│   ├── store/
│   └── package.json
├── prisma/                  # Prisma na raiz (uso local)
├── server.js                # Entrada do backend na raiz (desenvolvimento local)
├── package.json             # Dependências do backend na raiz (dev local)
└── README.md
```

---

## Configuração do Ambiente

### Pré-requisitos

- Node.js instalado
- PostgreSQL (local ou Neon.tech)

### Instalação e execução local

1. Clone o repositório:

```bash
git clone https://github.com/KayaMerlin/SaaS-Barbearia.git
cd SaaS-Barbearia
```

2. **Backend (raiz para desenvolvimento local):**

```bash
npm install
```

Crie um arquivo `.env` na raiz com:

```env
DATABASE_URL="sua_url_postgresql"
JWT_SECRET="sua_chave_secreta"
FRONTEND_URL="http://localhost:3000"
```

Aplique as migrações (a partir da raiz, usando o Prisma da raiz):

```bash
npx prisma migrate deploy
```

Inicie o servidor:

```bash
npm run dev
```

O backend estará em `http://localhost:4000`.

3. **Frontend:**

```bash
cd frontend
npm install
npm run dev
```

O frontend estará em `http://localhost:3000`. O arquivo `frontend/lib/api.ts` utiliza `baseURL` apontando para o backend em produção; para desenvolvimento local, altere temporariamente para `http://localhost:4000` ou utilize variável de ambiente.

---

## Variáveis de Ambiente em Produção (Vercel)

### Projeto Backend (API)

- **DATABASE_URL:** URL de conexão do banco PostgreSQL (Neon).
- **JWT_SECRET:** Chave utilizada para assinatura e verificação dos tokens JWT.
- **FRONTEND_URL:** URL do frontend na Vercel (ex.: `https://saa-s-barbearia-3i7d-oncps2y38-kayamerlins-projects.vercel.app`) para configuração do CORS. Sem barra no final.

### Projeto Frontend

O frontend consome a API pela URL do backend na Vercel. A `baseURL` em `frontend/lib/api.ts` e as chamadas `fetch` nas páginas públicas devem apontar para a URL do projeto de API na Vercel.

---

## Scripts Principais

- **Raiz (backend local):** `npm run dev` (nodemon em `server.js`), `npx prisma migrate deploy`, `npm test` (Jest).
- **backend/:** `npm run dev`, `npm start`, `postinstall` executa `prisma generate`.
- **frontend/:** `npm run dev`, `npm run build`, `npm start`.

---

## Próximos Passos Sugeridos

- Integração com gateway de pagamento real (Mercado Pago, Stripe ou similar) para PIX e assinatura.
- Hash de senha (por exemplo, bcrypt) antes de persistir no banco.
- Notificações (e-mail ou WhatsApp) para confirmação de agendamentos.
- Múltiplos profissionais por barbearia (agenda por profissional).

---

## Licença

Projeto de portfólio. Uso livre para estudo e referência.
