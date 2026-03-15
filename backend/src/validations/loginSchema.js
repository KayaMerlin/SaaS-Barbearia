const { z } = require('zod');

const loginSchema = z.object({
    email: z.string()
        .email({ message: 'Email inválido' })
        .max(100, { message: 'Email deve ter no máximo 100 caracteres' }),
    senha: z.string()
        .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
        .max(64, { message: 'Senha deve ter no máximo 64 caracteres' }),
});

module.exports = loginSchema;
