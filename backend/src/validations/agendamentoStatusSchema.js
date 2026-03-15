const { z } = require('zod');

const agendamentoStatusSchema = z.object({
    status: z.enum(["PENDENTE", "CONCLUIDO", "CANCELADO"], {
        errorMap: () => ({ message: "Status inválido. Use PENDENTE, CONCLUIDO ou CANCELADO." })
    })
});

module.exports = agendamentoStatusSchema;

