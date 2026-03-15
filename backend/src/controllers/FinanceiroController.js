const prisma = require('../config/db');

class FinanceiroController {
    async obterResumo(req, res) {
        try {
            const tenantId = req.usuario.tenantId;

            const transacoes = await prisma.transacao.findMany({
                where: { tenantId },
                include: {
                    agendamento: {
                        include: { cliente: true, servico: true }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });

            const resumo = transacoes.reduce((acc, tx) => {
                const valor = parseFloat(tx.valor);
                if (tx.status === 'PAGO') acc.totalRecebido += valor;
                if (tx.status === 'PENDENTE') acc.totalPendente += valor;
                return acc;
            }, { totalRecebido: 0, totalPendente: 0 });

            res.json({ resumo, historico: transacoes });
        } catch (error) {
            console.error(error);
            res.status(500).json({ erro: "Erro ao buscar dados financeiros." });
        }
    }
}

module.exports = new FinanceiroController();
