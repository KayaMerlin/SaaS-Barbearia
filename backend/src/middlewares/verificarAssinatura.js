const prisma = require('../config/db');

async function verificarAssinaturaAtiva(req, res, next) {
    try {
        const tenantId = req.usuario?.tenantId;
        if (!tenantId) {
            return res.status(401).json({ erro: 'Token inválido.', codigo: 'NAO_AUTENTICADO' });
        }

        const tenant = await prisma.tenant.findUnique({
            where: { id: tenantId }
        });

        if (!tenant) {
            return res.status(404).json({ erro: 'Tenant não encontrado.', codigo: 'TENANT_NAO_ENCONTRADO' });
        }

        const statusAssinatura = tenant.statusAssinatura ?? 'AGUARDANDO_PAGAMENTO';
        const dataVencimento = tenant.dataVencimento ?? null;
        const estaAtivo = statusAssinatura === 'ATIVO';
        const vencimentoOk = !dataVencimento || new Date(dataVencimento) >= new Date();

        if (estaAtivo && vencimentoOk) {
            return next();
        }

        return res.status(403).json({
            erro: 'Assinatura inativa ou vencida. Realize o pagamento para acessar o painel.',
            codigo: 'ASSINATURA_PENDENTE',
            statusAssinatura,
            dataVencimento
        });
    } catch (error) {
        console.error('verificarAssinaturaAtiva:', error);
        return res.status(500).json({ erro: 'Erro ao verificar assinatura.', codigo: 'ERRO_INTERNO' });
    }
}

module.exports = verificarAssinaturaAtiva;
