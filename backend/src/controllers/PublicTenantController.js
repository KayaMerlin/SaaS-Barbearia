const prisma = require('../config/db');

function getTenantBySlug(tenants, slug) {
    const tenantEncontrado = tenants.find((t) => {
        const nomeFormatado = t.nome.toLowerCase().replace(/\s+/g, '-');
        return nomeFormatado === slug.toLowerCase();
    });
    return tenantEncontrado;
}

class PublicTenantController {
    async buscarPorSlug(req, res) {
        try {
            const { slug } = req.params;

            if (!slug) {
                return res.status(400).json({ erro: 'Slug da barbearia é obrigatório.' });
            }

            const tenants = await prisma.tenant.findMany({
                select: { id: true, nome: true, logoUrl: true, ativo: true }
            });

            const tenant = getTenantBySlug(tenants, slug);

            if (!tenant || !tenant.ativo) {
                return res.status(404).json({ erro: 'Barbearia não encontrada ou inativa.' });
            }

            return res.json({
                nome: tenant.nome,
                logoUrl: tenant.logoUrl,
                ativo: tenant.ativo
            });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ erro: 'Erro interno ao buscar a barbearia.' });
        }
    }
}

module.exports = new PublicTenantController();
