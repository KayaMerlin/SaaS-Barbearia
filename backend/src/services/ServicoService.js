const prisma = require('../config/db');

class ServicoService {
    async criarServico(dados, tenantId) {
        const novoServico = await prisma.servico.create({
            data: {
                nome: dados.nome,
                preco: dados.preco,
                duracao: dados.duracao,
                tenantId: tenantId
            }
        });

        return novoServico;
    }

    async listarServicos(tenantId) {
        const servicos = await prisma.servico.findMany({
            where: { tenantId: tenantId }
        });

        return servicos;
    }
}

module.exports = new ServicoService();

