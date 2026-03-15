const prisma = require('../config/db');

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
}

module.exports = new WebhookController();
