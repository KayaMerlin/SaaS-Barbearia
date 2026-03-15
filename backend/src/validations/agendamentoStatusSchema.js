const { z } = require('zod');

const agendamentoStatusSchema = z.object({
    status: z.enum(["PENDENTE", "AGUARDANDO_PAGAMENTO", "CONFIRMADO", "CONCLUIDO", "CANCELADO"], {
        errorMap: () => ({ message: "Status inválido." })
    })
});

module.exports = agendamentoStatusSchema;

