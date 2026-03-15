const prisma = require('../config/db');

class ClienteService {
    async criarCliente(nome, telefone, tenantId) {
        const clienteExistente = await prisma.cliente.findFirst({
            where: {
                telefone: telefone,
                tenantId: tenantId
            }
        });

        if (clienteExistente) {
            throw new Error("Já existe um cliente cadastrado com este telefone.");
        }

        const novoCliente = await prisma.cliente.create({
            data: {
                nome: nome,
                telefone: telefone,
                tenantId: tenantId
            }
        });

        return novoCliente;
    }

    async listarClientes(tenantId) {
        const clientes = await prisma.cliente.findMany({
            where: { tenantId: tenantId }
        });
        return clientes;
    }

    async excluirCliente(id, tenantId) {
        const cliente = await prisma.cliente.findFirst({
            where: { id, tenantId }
        });
        if (!cliente) {
            throw new Error("Cliente não encontrado.");
        }
        const agendamentos = await prisma.agendamento.findMany({
            where: { clienteId: id }
        });
        const agendamentoIds = agendamentos.map((a) => a.id);
        await prisma.transacao.deleteMany({
            where: { agendamentoId: { in: agendamentoIds } }
        });
        await prisma.agendamento.deleteMany({ where: { clienteId: id } });
        await prisma.cliente.delete({ where: { id } });
    }
}

module.exports = new ClienteService();
