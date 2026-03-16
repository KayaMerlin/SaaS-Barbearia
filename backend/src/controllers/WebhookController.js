const prisma = require('../config/db');
const { obterStatusPagamento } = require('../services/MercadoPagoService');

class WebhookController {
    async receberConfirmacaoPix(req, res) {
        try {
            const { transacaoId, statusPagamento } = req.body;

            if (!transacaoId) {
                return res.status(400).json({ erro: "ID da transação não informado." });
            }

            if (statusPagamento === "PAGO") {
                await prisma.$transaction(async (tx) => {
                    const transacao = await tx.transacao.update({
                        where: { id: transacaoId },
                        data: { status: "PAGO" }
                    });

                    await tx.agendamento.update({
                        where: { id: transacao.agendamentoId },
                        data: { status: "CONFIRMADO" }
                    });
                });

                console.log(`💰 Dinheiro na conta! Transação ${transacaoId} aprovada.`);
                return res.json({ recebido: true });
            }

            return res.status(200).json({ mensagem: "Status ignorado." });
        } catch (error) {
            console.error("Erro no Webhook:", error);
            return res.status(500).json({ erro: "Falha ao processar webhook." });
        }
    }

    async receberConfirmacaoAssinatura(req, res) {
        try {
            const { pagamentoId, statusPagamento } = req.body;

            if (!pagamentoId) {
                return res.status(400).json({ erro: "ID do pagamento não informado." });
            }

            if (statusPagamento === "PAGO") {
                await prisma.$transaction(async (tx) => {
                    const pagamento = await tx.pagamentoAssinatura.update({
                        where: { id: pagamentoId },
                        data: { status: "PAGO" }
                    });

                    const dataVencimento = new Date();
                    dataVencimento.setDate(dataVencimento.getDate() + 30);

                    await tx.tenant.update({
                        where: { id: pagamento.tenantId },
                        data: {
                            statusAssinatura: "ATIVO",
                            dataVencimento
                        }
                    });
                });

                console.log(`📋 Assinatura ativada! Pagamento ${pagamentoId} aprovado.`);
                return res.json({ recebido: true });
            }

            return res.status(200).json({ mensagem: "Status ignorado." });
        } catch (error) {
            console.error("Erro no Webhook Assinatura:", error);
            return res.status(500).json({ erro: "Falha ao processar webhook de assinatura." });
        }
    }

    async receberNotificacaoMercadoPago(req, res) {
        try {
            let paymentId = null;
            if (req.body?.data?.id) {
                paymentId = String(req.body.data.id);
            } else if (req.body?.id) {
                paymentId = String(req.body.id);
            }
            if (!paymentId) {
                return res.status(400).json({ erro: "ID do pagamento não informado." });
            }

            const tokenMP = process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
            if (!tokenMP) {
                return res.status(200).json({ mensagem: "Token Mercado Pago não configurado." });
            }

            const status = await obterStatusPagamento(tokenMP, paymentId);
            if (status !== 'approved') {
                return res.status(200).json({ mensagem: "Pagamento ainda não aprovado.", status });
            }

            const transacao = await prisma.transacao.findUnique({
                where: { mercadoPagoPaymentId: paymentId }
            });
            if (transacao) {
                await prisma.$transaction(async (tx) => {
                    await tx.transacao.update({
                        where: { id: transacao.id },
                        data: { status: 'PAGO' }
                    });
                    await tx.agendamento.update({
                        where: { id: transacao.agendamentoId },
                        data: { status: 'CONFIRMADO' }
                    });
                });
                console.log(`💰 PIX confirmado via Mercado Pago. Transação ${transacao.id} → Agendamento CONFIRMADO.`);
                return res.json({ recebido: true });
            }

            const pagamentoAssinatura = await prisma.pagamentoAssinatura.findUnique({
                where: { mercadoPagoPaymentId: paymentId },
                include: { tenant: true }
            });
            if (pagamentoAssinatura) {
                const dataVencimento = new Date();
                dataVencimento.setDate(dataVencimento.getDate() + 30);
                await prisma.$transaction(async (tx) => {
                    await tx.pagamentoAssinatura.update({
                        where: { id: pagamentoAssinatura.id },
                        data: { status: 'PAGO' }
                    });
                    await tx.tenant.update({
                        where: { id: pagamentoAssinatura.tenantId },
                        data: { statusAssinatura: 'ATIVO', dataVencimento }
                    });
                });
                console.log(`📋 Mensalidade paga! Tenant ${pagamentoAssinatura.tenantId} ativo até ${dataVencimento.toISOString().split('T')[0]}.`);
                return res.json({ recebido: true });
            }

            return res.status(200).json({ mensagem: "Pagamento não vinculado a agendamento nem assinatura." });
        } catch (error) {
            console.error("Erro no Webhook Mercado Pago:", error);
            return res.status(500).json({ erro: "Falha ao processar webhook Mercado Pago." });
        }
    }
}

module.exports = new WebhookController();
