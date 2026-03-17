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

  for (const ag of agendamentos) {
    try {
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
