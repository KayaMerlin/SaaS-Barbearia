const crypto = require('crypto');
const prisma = require('../config/db');

const VALOR_MENSALIDADE = 49.9;

class AssinaturaController {
    async obterStatus(req, res) {
        try {
            const tenantId = req.usuario.tenantId;
            const tenant = await prisma.tenant.findUnique({
                where: { id: tenantId }
            });
            if (!tenant) {
                return res.status(404).json({ erro: 'Tenant não encontrado.' });
            }
            const statusAssinatura = tenant.statusAssinatura ?? 'AGUARDANDO_PAGAMENTO';
            const dataVencimento = tenant.dataVencimento ?? null;
            const estaAtivo = statusAssinatura === 'ATIVO';
            const vencimentoOk = !dataVencimento || new Date(dataVencimento) >= new Date();
            res.json({
                statusAssinatura,
                dataVencimento,
                podeAcessarPainel: estaAtivo && vencimentoOk
            });
        } catch (error) {
            console.error('AssinaturaController.obterStatus:', error);
            res.status(500).json({ erro: 'Erro ao buscar status da assinatura.' });
        }
    }

    async gerarPix(req, res) {
        try {
            const tenantId = req.usuario.tenantId;

            const hashPix = crypto.randomBytes(16).toString('hex');
            const codigoPixSimulado = `00020126580014br.gov.bcb.pix0136${hashPix}5204000053039865802BR5922BarberSaaS Assinatura...`;

            const pagamento = await prisma.pagamentoAssinatura.create({
                data: {
                    tenantId,
                    valor: VALOR_MENSALIDADE,
                    status: 'PENDENTE',
                    codigoPix: codigoPixSimulado
                }
            });

            res.status(201).json({
                mensagem: 'PIX gerado. Realize o pagamento para ativar sua assinatura.',
                pagamentoId: pagamento.id,
                valor: pagamento.valor,
                codigoPix: pagamento.codigoPix
            });
        } catch (error) {
            console.error('AssinaturaController.gerarPix:', error);
            res.status(500).json({ erro: 'Erro ao gerar PIX da assinatura.' });
        }
    }
}

module.exports = new AssinaturaController();
