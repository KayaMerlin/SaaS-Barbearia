jest.mock('../config/db', () => ({
    transacao: { findUnique: jest.fn() },
    pagamentoAssinatura: { findUnique: jest.fn() },
    $transaction: jest.fn(),
}));
jest.mock('../services/MercadoPagoService', () => ({
    obterStatusPagamento: jest.fn(),
}));

const prisma = require('../config/db');
const { obterStatusPagamento } = require('../services/MercadoPagoService');
const webhookController = require('./WebhookController');

function response() {
    const res = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res;
}

describe('Webhook Mercado Pago', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        prisma.transacao.findUnique.mockResolvedValue(null);
        prisma.pagamentoAssinatura.findUnique.mockResolvedValue(null);
    });

    test('não aceita ID de pagamento inválido', async () => {
        const res = response();
        await webhookController.receberNotificacaoMercadoPago({ body: { data: { id: '../../other' } } }, res);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(obterStatusPagamento).not.toHaveBeenCalled();
    });

    test('não confirma pagamento apenas por conteúdo recebido no webhook', async () => {
        prisma.transacao.findUnique.mockResolvedValue({
            id: 'tx1',
            agendamentoId: 'ag1',
            tenant: { mercadoPagoAccessToken: 'token-do-estabelecimento' },
        });
        obterStatusPagamento.mockResolvedValue('pending');
        const res = response();
        await webhookController.receberNotificacaoMercadoPago({
            body: { data: { id: '12345' }, statusPagamento: 'PAGO' },
        }, res);
        expect(obterStatusPagamento).toHaveBeenCalledWith('token-do-estabelecimento', '12345');
        expect(prisma.$transaction).not.toHaveBeenCalled();
        expect(res.json).toHaveBeenCalledWith(expect.objectContaining({ status: 'pending' }));
    });

    test('confirma uma única vez e ignora repetição do evento aprovado', async () => {
        prisma.transacao.findUnique.mockResolvedValue({
            id: 'tx1',
            agendamentoId: 'ag1',
            tenant: { mercadoPagoAccessToken: 'token-do-estabelecimento' },
        });
        obterStatusPagamento.mockResolvedValue('approved');
        const tx = {
            transacao: { updateMany: jest.fn().mockResolvedValueOnce({ count: 1 }).mockResolvedValueOnce({ count: 0 }) },
            agendamento: { updateMany: jest.fn().mockResolvedValue({ count: 1 }) },
        };
        prisma.$transaction.mockImplementation(fn => fn(tx));

        const req = { body: { data: { id: '12345' } } };
        const res = response();
        await webhookController.receberNotificacaoMercadoPago(req, res);
        await webhookController.receberNotificacaoMercadoPago(req, res);

        expect(tx.agendamento.updateMany).toHaveBeenCalledTimes(1);
        expect(tx.agendamento.updateMany).toHaveBeenCalledWith({
            where: { id: 'ag1', status: 'AGUARDANDO_PAGAMENTO' },
            data: { status: 'CONFIRMADO' },
        });
        expect(res.status).not.toHaveBeenCalledWith(500);
    });
});
