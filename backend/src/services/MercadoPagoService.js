const { MercadoPagoConfig, Payment } = require('mercadopago');

function getClient(accessToken) {
    const token = accessToken?.trim() || process.env.MERCADOPAGO_ACCESS_TOKEN?.trim();
    if (!token) {
        throw new Error('Token do Mercado Pago não configurado. Defina MERCADOPAGO_ACCESS_TOKEN no .env ou nas Configurações.');
    }
    return new MercadoPagoConfig({ accessToken: token });
}

async function criarPagamentoPix(accessToken, { valor, descricao, emailPagador, externalReference, nomeCliente }) {
    const client = getClient(accessToken);
    const payment = new Payment(client);

    const idempotencyKey = require('crypto').randomUUID();

    const response = await payment.create({
        body: {
            transaction_amount: Number(valor),
            description: descricao || 'Reserva de Horário - BarberSaaS',
            payment_method_id: 'pix',
            payer: {
                email: emailPagador || 'cliente@barbersaas.com',
                first_name: nomeCliente || 'Cliente'
            },
            external_reference: externalReference || undefined
        },
        requestOptions: {
            idempotencyKey
        }
    });

    const transactionData = response.point_of_interaction?.transaction_data;
    if (!transactionData?.qr_code) {
        throw new Error('Mercado Pago não retornou o código PIX. Tente novamente.');
    }

    return {
        paymentId: String(response.id),
        codigoPix: transactionData.qr_code,
        qrCodeBase64: transactionData.qr_code_base64 || null
    };
}

async function obterStatusPagamento(accessToken, paymentId) {
    const client = getClient(accessToken);
    const payment = new Payment(client);
    const response = await payment.get({ id: paymentId });
    return response.status;
}

module.exports = {
    criarPagamentoPix,
    obterStatusPagamento
};
