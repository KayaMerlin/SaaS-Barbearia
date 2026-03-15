const { z } = require('zod');

const clienteSchema = z.object({
    nome: z.string()
        .min(2, { message: 'O nome do cliente deve ter pelo menos 2 caracteres' })
        .max(100, { message: 'O nome é muito grande' })
        .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, { message: 'O nome deve conter apenas letras e espaços' }),

    telefone: z.string()
        .min(10, { message: 'O telefone deve ter pelo menos 10 dígitos (com DDD)' })
        .max(15, { message: 'O telefone é muito grande' })
        .regex(/^[0-9]+$/, { message: 'O telefone deve conter apenas números' })
});

module.exports = clienteSchema;
