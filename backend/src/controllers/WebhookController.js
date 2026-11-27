const prisma = require('../config/db');
const { obterStatusPagamento } = require('../services/MercadoPagoService');

class WebhookController {
    // Somente pagamentos confirmados diretamente pela API do provedor podem alterar reservas/assinaturas.
    async receberNotificacaoMercadoPago(req, res) {
        try {
            const rawPaymentId = req.body?.data?.id ?? req.body?.id;
            const paymentId = rawPaymentId == null ? '' : String(rawPaymentId);

            if (!/^\d+$/.test(paymentId)) {
                return res.status(400).json({ erro: 'ID do pagamento inválido.' });
            }

            // Localiza o pagamento no banco antes de consultar o provedor.
            const transacao = await prisma.transacao.findUnique({
                where: { mercadoPagoPaymentId: paymentId },
                include: { tenant: true }
            });
            const pagamentoAssinatura = transacao ? null : await prisma.pagamentoAssinatura.findUnique({
                where: { mercadoPagoPaymentId: paymentId }
            });

            if (!transacao && !pagamentoAssinatura) {
                return res.status(200).json({ mensagem: 'Pagamento não vinculado a uma cobrança conhecida.' });
            }

            // Reservas usam o token do estabelecimento; assinaturas usam o token da plataforma.
            const tokenMP = (transacao ? transacao.tenant?.mercadoPagoAccessToken?.trim() : null)
                || process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
            if (!tokenMP) {
                return res.status(503).json({ erro: 'Integração de pagamento indisponível.' });
            }

            const status = await obterStatusPagamento(tokenMP, paymentId);
            if (status !== 'approved') {
                return res.status(200).json({ mensagem: 'Pagamento ainda não aprovado.', status });
            }

            if (transacao) {
                // updateMany condicional impede reprocessamento por webhooks repetidos.
                const resultado = await prisma.$transaction(async (tx) => {
                    const atualizada = await tx.transacao.updateMany({
                        where: { id: transacao.id, status: { not: 'PAGO' } },
                        data: { status: 'PAGO' }
                    });
                    if (!atualizada.count) return { alterada: false, confirmada: false };

                    // Uma reserva cancelada não deve ser ressuscitada automaticamente.
                    const reserva = await tx.agendamento.updateMany({
                        where: { id: transacao.agendamentoId, status: 'AGUARDANDO_PAGAMENTO' },
                        data: { status: 'CONFIRMADO' }
                    });
                    return { alterada: true, confirmada: reserva.count === 1 };
                });

                if (resultado.alterada && !resultado.confirmada) {
                    console.warn('Pagamento aprovado para reserva que exige conferência manual:', transacao.id);
                }
                return res.json({ recebido: true });
            }

            // Renovação de mensalidade: evento repetido não concede mais 30 dias.
            const renovada = await prisma.$transaction(async (tx) => {
                const atualizada = await tx.pagamentoAssinatura.updateMany({
                    where: { id: pagamentoAssinatura.id, status: { not: 'PAGO' } },
                    data: { status: 'PAGO' }
                });
                if (!atualizada.count) return false;

                const tenant = await tx.tenant.findUnique({
                    where: { id: pagamentoAssinatura.tenantId },
                    select: { dataVencimento: true }
                });
                if (!tenant) throw new Error('Assinante não encontrado.');

                const agora = new Date();
                const base = tenant.dataVencimento && tenant.dataVencimento > agora
                    ? new Date(tenant.dataVencimento)
                    : agora;
                const dataVencimento = new Date(base);
                dataVencimento.setUTCDate(dataVencimento.getUTCDate() + 30);

                await tx.tenant.update({
                    where: { id: pagamentoAssinatura.tenantId },
                    data: { statusAssinatura: 'ATIVO', dataVencimento }
                });
                return true;
            });
            return res.json({ recebido: true, renovada });
        } catch (error) {
            console.error('Erro no webhook Mercado Pago:', error);
            return res.status(500).json({ erro: 'Falha ao processar webhook de pagamento.' });
        }
    }
}

module.exports = new WebhookController();
