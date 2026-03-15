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
}

module.exports = new ClienteService();
