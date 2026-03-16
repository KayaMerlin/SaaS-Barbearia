const prisma = require('../config/db');

async function runLembreteJob() {
  const agora = new Date();
  const daquiDuasHoras = new Date(agora.getTime() + 2 * 60 * 60 * 1000);
  const daquiDuasHorasEMeia = new Date(agora.getTime() + 2.5 * 60 * 60 * 1000);

  const agendamentos = await prisma.agendamento.findMany({
    where: {
      status: 'CONFIRMADO',
      lembreteEnviado: false,
      dataHora: {
        gte: daquiDuasHoras,
        lte: daquiDuasHorasEMeia
      }
    },
    include: { cliente: true, servico: true, tenant: true }
  });

  const url = process.env.LEMBRETE_WHATSAPP_URL?.trim();
  const token = process.env.LEMBRETE_WHATSAPP_TOKEN?.trim();

  for (const ag of agendamentos) {
    try {
      const horaFormatada = new Date(ag.dataHora).toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      });
      const mensagem = `Olá ${ag.cliente.nome}! ✂️ Lembrete: seu horário de *${ag.servico.nome}* na *${ag.tenant.nome}* hoje às *${horaFormatada}*. Te esperamos!`;

      if (url && token) {
        let num = String(ag.cliente.telefone).replace(/\D/g, '');
        if (num.length === 10 || num.length === 11) num = '55' + num;
        await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({ number: num, message: mensagem })
        });
      }

      await prisma.agendamento.update({
        where: { id: ag.id },
        data: { lembreteEnviado: true }
      });
    } catch (err) {
      console.error('LembreteJob erro:', ag.cliente?.nome, err.message);
    }
  }

  return agendamentos.length;
}

module.exports = { runLembreteJob };
