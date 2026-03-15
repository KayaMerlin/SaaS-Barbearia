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

const app = express();
const porta = process.env.PORT || 4000;

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
app.use('/files', express.static(path.resolve(__dirname, 'uploads')));
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
