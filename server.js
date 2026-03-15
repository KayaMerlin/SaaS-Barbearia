const express = require('express');
const path = require('path');
require('dotenv').config();
const cors = require('cors');
const servicoRoutes = require('./backend/src/routes/servicoRoutes');
const uploadRoutes = require('./backend/src/routes/uploadRoutes');
const authRoutes = require('./backend/src/routes/authRoutes');
const barbeariaRoutes = require('./backend/src/routes/barbeariaRoutes');
const clienteRoutes = require('./backend/src/routes/clienteRoutes');
const agendamentoRoutes = require('./backend/src/routes/agendamentoRoutes');
const publicRoutes = require('./backend/src/routes/publicRoutes');
const publicTenantRoutes = require('./backend/src/routes/publicTenantRoutes');
const configuracaoRoutes = require('./backend/src/routes/configuracaoRoutes');
const webhookRoutes = require('./backend/src/routes/webhookRoutes');
const financeiroRoutes = require('./backend/src/routes/financeiroRoutes');
const assinaturaRoutes = require('./backend/src/routes/assinaturaRoutes');

const app = express();
const porta = 4000;

const frontOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
app.use(cors({ origin: frontOrigin }));
app.use(express.json());
app.use(servicoRoutes);
app.use(authRoutes);
app.use(barbeariaRoutes);
app.use(clienteRoutes);
app.use(agendamentoRoutes);
app.use('/public', publicRoutes);
app.use('/public/tenant', publicTenantRoutes);
app.use('/files', express.static(path.resolve(__dirname, 'backend', 'uploads')));
app.use('/upload', uploadRoutes);
app.use('/configuracoes', configuracaoRoutes);
app.use('/webhook', webhookRoutes);
app.use('/financeiro', financeiroRoutes);
app.use('/assinatura', assinaturaRoutes);

app.get('/', (req, res) => {
  res.json({
    mensagem: '🚀 API do BarberSaaS Online!',
    status: 'ok',
    versao: '1.0.0'
  });
});

app.listen(porta, () => {
    console.log(`Servidor rodando na porta ${porta}`);
});