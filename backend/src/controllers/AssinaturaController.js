const prisma = require('../config/db');
const { criarPagamentoPix } = require('../services/MercadoPagoService');

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
            const tokenMP = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
            if (!tokenMP) {
                return res.status(503).json({ erro: 'Pagamentos temporariamente indisponíveis. Tente mais tarde.' });
            }

            const user = await prisma.user.findFirst({ where: { tenantId } });
            const emailPagador = user?.email || `assinatura-${tenantId}@barbersaas.com`;

            const pagamento = await prisma.pagamentoAssinatura.create({
                data: {
                    tenantId,
                    valor: VALOR_MENSALIDADE,
                    status: 'PENDENTE',
                    codigoPix: null
                }
            });

            let codigoPixFinal = null;
            let qrCodeBase64 = null;
            let mercadoPagoPaymentId = null;

            try {
                const pix = await criarPagamentoPix(tokenMP, {
                    valor: VALOR_MENSALIDADE,
                    descricao: 'Mensalidade BarberSaaS',
                    emailPagador,
                    externalReference: tenantId,
                    nomeCliente: user?.nome || 'Assinante'
                });
                codigoPixFinal = pix.codigoPix;
                qrCodeBase64 = pix.qrCodeBase64;
                mercadoPagoPaymentId = pix.paymentId;
                await prisma.pagamentoAssinatura.update({
                    where: { id: pagamento.id },
                    data: { codigoPix: codigoPixFinal, mercadoPagoPaymentId }
                });
            } catch (err) {
                await prisma.pagamentoAssinatura.delete({ where: { id: pagamento.id } }).catch(() => {});
                console.error('AssinaturaController.gerarPix MP:', err);
                throw new Error(err.message || 'Falha ao gerar PIX. Tente novamente.');
            }

            res.status(201).json({
                mensagem: 'PIX gerado. Realize o pagamento para ativar sua assinatura.',
                pagamentoId: pagamento.id,
                valor: VALOR_MENSALIDADE,
                codigoPix: codigoPixFinal,
                qrCodeBase64: qrCodeBase64 || undefined
            });
        } catch (error) {
            console.error('AssinaturaController.gerarPix:', error);
            res.status(500).json({ erro: error.message || 'Erro ao gerar PIX da assinatura.' });
        }
    }
}

module.exports = new AssinaturaController();
