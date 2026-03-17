const prisma = require('../config/db');

class AgendamentoService {
    async criarAgendamento(tenantId, clienteId, servicoId, dataHora) {
        const dataHoraDate = new Date(dataHora);

        if (dataHoraDate.getTime() < Date.now()) {
            throw new Error("Não é possível marcar um agendamento no passado.");
        }

        const cliente = await prisma.cliente.findFirst({
            where: { id: clienteId, tenantId: tenantId }
        });
        if (!cliente) {
            throw new Error("Cliente não encontrado ou não pertence a esta barbearia.");
        }

        const servico = await prisma.servico.findFirst({
            where: { id: servicoId, tenantId: tenantId }
        });
        if (!servico) {
            throw new Error("Serviço não encontrado ou não pertence a esta barbearia.");
        }

        const horarioOcupado = await prisma.agendamento.findFirst({
            where: {
                tenantId: tenantId,
                dataHora: dataHoraDate,
                status: { not: 'CANCELADO' }
            }
        });
        if (horarioOcupado) {
            throw new Error("Este horário já está reservado para outro cliente.");
        }

        const novoAgendamento = await prisma.agendamento.create({
            data: {
                tenantId,
                clienteId,
                servicoId,
                dataHora: dataHoraDate,
                status: 'PENDENTE'
            },
            include: {
                cliente: true,
                servico: true
            }
        });

        return novoAgendamento;
    }

    async listarPorData(tenantId, dataISO) {
        const inicioDia = new Date(`${dataISO}T00:00:00.000Z`);
        const fimDia = new Date(`${dataISO}T23:59:59.999Z`);

        const limiteExpiracao = new Date(Date.now() - 30 * 60 * 1000);
        await prisma.agendamento.updateMany({
            where: {
                tenantId,
                status: 'AGUARDANDO_PAGAMENTO',
                createdAt: { lt: limiteExpiracao }
            },
            data: { status: 'CANCELADO' }
        });

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                tenantId: tenantId,
                dataHora: {
                    gte: inicioDia,
                    lte: fimDia
                }
            },
            include: {
                cliente: true,
                servico: true,
                transacao: true
            },
            orderBy: {
                dataHora: 'asc'
            }
        });

        return agendamentos;
    }

    async finalizarPagamentoDinheiro(agendamentoId, tenantId) {
        const agendamento = await prisma.agendamento.findFirst({
            where: { id: agendamentoId, tenantId },
            include: { transacao: true, servico: true }
        });

        if (!agendamento) {
            throw new Error("Agendamento não encontrado ou não pertence a esta barbearia.");
        }

        if (agendamento.status !== 'CONFIRMADO') {
            throw new Error("Só é possível finalizar pagamento em dinheiro para agendamentos confirmados.");
        }

        if (!agendamento.transacao || agendamento.transacao.metodo !== 'DINHEIRO') {
            throw new Error("Este agendamento não é de pagamento em dinheiro.");
        }

        if (agendamento.transacao.status !== 'PENDENTE') {
            throw new Error("Este pagamento em dinheiro já foi finalizado.");
        }

        await prisma.$transaction([
            prisma.agendamento.update({
                where: { id: agendamentoId },
                data: { status: 'CONCLUIDO' }
            }),
            prisma.transacao.update({
                where: { id: agendamento.transacao.id },
                data: { status: 'CONCLUIDO' }
            })
        ]);

        return prisma.agendamento.findUnique({
            where: { id: agendamentoId },
            include: { cliente: true, servico: true, transacao: true }
        });
    }

    async atualizarStatus(agendamentoId, tenantId, novoStatus) {
        const agendamentoExistente = await prisma.agendamento.findFirst({
            where: {
                id: agendamentoId,
                tenantId: tenantId
            }
        });

        if (!agendamentoExistente) {
            throw new Error("Agendamento não encontrado ou não pertence a esta barbearia.");
        }

        const agendamentoAtualizado = await prisma.agendamento.update({
            where: { id: agendamentoId },
            data: { status: novoStatus }
        });

        return agendamentoAtualizado;
    }

    async resumoSemana(tenantId) {
        const hoje = new Date();
        const inicioSemana = new Date(hoje);
        inicioSemana.setDate(hoje.getDate() - 6);
        inicioSemana.setHours(0, 0, 0, 0);
        const fimSemana = new Date(hoje);
        fimSemana.setHours(23, 59, 59, 999);

        const agendamentos = await prisma.agendamento.findMany({
            where: {
                tenantId,
                dataHora: { gte: inicioSemana, lte: fimSemana },
                status: { in: ['CONFIRMADO', 'CONCLUIDO'] }
            },
            include: { servico: true },
            orderBy: { dataHora: 'asc' }
        });

        const toDataISO = (date) => {
            const y = date.getFullYear();
            const m = String(date.getMonth() + 1).padStart(2, '0');
            const d = String(date.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        };
        const diasSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
        const porDia = {};
        for (let i = 0; i < 7; i++) {
            const d = new Date(inicioSemana);
            d.setDate(inicioSemana.getDate() + i);
            const dataISO = toDataISO(d);
            const diaNum = d.getDate();
            const diaNome = diasSemana[d.getDay()];
            porDia[dataISO] = { dia: `${diaNome} ${diaNum}`, cortes: 0, receita: 0 };
        }

        for (const ag of agendamentos) {
            const dataISO = toDataISO(new Date(ag.dataHora));
            if (!porDia[dataISO]) continue;
            porDia[dataISO].cortes += 1;
            const preco = Number(ag.servico?.preco ?? 0);
            if (ag.status === 'CONCLUIDO') {
                porDia[dataISO].receita += preco;
            }
        }

        return Object.keys(porDia)
            .sort()
            .map((dataISO) => ({ ...porDia[dataISO], dataISO }));
    }
}

module.exports = new AgendamentoService();
