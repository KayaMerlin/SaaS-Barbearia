const { z } = require('zod');

const agendamentoSchema = z.object({
    clienteId: z.string({ required_error: 'O ID do cliente é obrigatório' })
        .uuid({ message: 'O ID do cliente deve ser um código UUID válido' }),

    servicoId: z.string({ required_error: 'O ID do serviço é obrigatório' })
        .uuid({ message: 'O ID do serviço deve ser um código UUID válido' }),

    dataHora: z.string({ required_error: 'A data e hora são obrigatórias' })
        .datetime({ message: 'Formato de data inválido. Use o padrão ISO 8601 (ex: 2026-03-10T14:30:00Z)' })
});

module.exports = agendamentoSchema;
