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
                servico: true
            },
            orderBy: {
                dataHora: 'asc'
            }
        });

        return agendamentos;
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
}

module.exports = new AgendamentoService();
