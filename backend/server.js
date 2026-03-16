const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const servicoRoutes = require('./src/routes/servicoRoutes');
const uploadRoutes = require('./src/routes/uploadRoutes');
const authRoutes = require('./src/routes/authRoutes');
const barbeariaRoutes = require('./src/routes/barbeariaRoutes');
const clienteRoutes = require('./src/routes/clienteRoutes');
const agendamentoRoutes = require('./src/routes/agendamentoRoutes');
const publicRoutes = require('./src/routes/publicRoutes');
const publicTenantRoutes = require('./src/routes/publicTenantRoutes');
const configuracaoRoutes = require('./src/routes/configuracaoRoutes');
const webhookRoutes = require('./src/routes/webhookRoutes');
const financeiroRoutes = require('./src/routes/financeiroRoutes');
const assinaturaRoutes = require('./src/routes/assinaturaRoutes');
const adminRoutes = require('./src/routes/adminRoutes');

const app = express();
const porta = process.env.PORT || 4000;

const allowedOrigins = [
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'https://saa-s-barbearia-4ctt.vercel.app',

  process.env.FRONTEND_URL,
].filter(Boolean);
const uniqueOrigins = [...new Set(allowedOrigins)];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || uniqueOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(servicoRoutes);
app.use(authRoutes);
app.use(barbeariaRoutes);
app.use(clienteRoutes);
app.use(agendamentoRoutes);
app.use('/public', publicRoutes);
app.use('/public/tenant', publicTenantRoutes);
app.use('/files', express.static(path.resolve(__dirname, 'uploads')));
app.use('/upload', uploadRoutes);
app.use('/configuracoes', configuracaoRoutes);
app.use('/webhook', webhookRoutes);
app.use('/financeiro', financeiroRoutes);
app.use('/assinatura', assinaturaRoutes);
app.use('/admin', adminRoutes);

app.get('/', (req, res) => {
  res.json({
    mensagem: '🚀 API do BarberSaaS Online!',
    status: 'ok',
    versao: '1.0.0'
  });
});

const { runLembreteJob } = require('./src/jobs/lembreteJob');
app.get('/cron/lembrete', (req, res) => {
  const secret = process.env.CRON_SECRET?.trim();
  if (secret && req.query.secret !== secret) {
    return res.status(403).json({ erro: 'Forbidden' });
  }
  runLembreteJob()
    .then((n) => res.json({ ok: true, processados: n }))
    .catch((e) => {
      console.error('cron/lembrete', e);
      res.status(500).json({ erro: e.message });
    });
});

if (process.env.ENABLE_LEMBRETE_CRON === 'true') {
  const cron = require('node-cron');
  cron.schedule('*/30 * * * *', () => {
    runLembreteJob().then((n) => n > 0 && console.log('LembreteJob:', n, 'enviados'));
  });
}

app.listen(porta, () => {
  console.log(`Servidor rodando na porta ${porta}`);
});
