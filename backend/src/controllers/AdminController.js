const prisma = require('../config/db');

class AdminController {
    async listarTenants(req, res) {
        try {
            const tenants = await prisma.tenant.findMany({
                include: {
                    users: { select: { email: true, nome: true } }
                },
                orderBy: { createdAt: 'desc' }
            });
            const lista = tenants.map((t) => ({
                id: t.id,
                nome: t.nome,
                slug: t.slug,
                email: t.users[0]?.email ?? null,
                statusAssinatura: t.statusAssinatura ?? 'AGUARDANDO_PAGAMENTO',
                dataVencimento: t.dataVencimento,
                createdAt: t.createdAt
            }));
            const faturamentoMes = await prisma.pagamentoAssinatura.aggregate({
                where: {
                    status: 'PAGO',
                    createdAt: {
                        gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                    }
                },
                _sum: { valor: true }
            });
            res.json({
                tenants: lista,
                faturamentoMes: Number(faturamentoMes._sum?.valor ?? 0)
            });
        } catch (error) {
            console.error('AdminController.listarTenants:', error);
            res.status(500).json({ erro: 'Erro ao listar barbearias.' });
        }
    }

    async estenderVencimento(req, res) {
        try {
            const { id } = req.params;
            const tenant = await prisma.tenant.findUnique({ where: { id } });
            if (!tenant) {
                return res.status(404).json({ erro: 'Barbearia não encontrada.' });
            }
            const base = tenant.dataVencimento && new Date(tenant.dataVencimento) > new Date()
                ? new Date(tenant.dataVencimento)
                : new Date();
            base.setDate(base.getDate() + 30);
            await prisma.tenant.update({
                where: { id },
                data: { dataVencimento: base, statusAssinatura: 'ATIVO' }
            });
            res.json({
                mensagem: 'Vencimento estendido em 30 dias.',
                dataVencimento: base
            });
        } catch (error) {
            console.error('AdminController.estenderVencimento:', error);
            res.status(500).json({ erro: 'Erro ao estender vencimento.' });
        }
    }
}

module.exports = new AdminController();
