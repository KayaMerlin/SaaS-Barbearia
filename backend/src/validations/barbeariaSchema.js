const { z } = require('zod');

const barbeariaSchema = z.object({
    nomeBarbearia: z.string()
        .trim()
        .min(3, { message: 'Nome da barbearia deve ter pelo menos 3 caracteres' })
        .max(100, { message: 'Nome da barbearia deve ter no máximo 100 caracteres' })
        .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, { message: 'Nome da barbearia deve conter apenas letras e espaços.' }),
    nomeUsuario: z.string()
        .trim()
        .min(3, { message: 'Nome do usuário deve ter pelo menos 3 caracteres' })
        .max(50, { message: 'Nome do usuário deve ter no máximo 50 caracteres' })
        .regex(/^[A-Za-zÀ-ÿ\s'-]+$/, { message: 'Nome do usuário deve conter apenas letras e espaços.' }),
    email: z.string()
        .email({ message: 'Email inválido' })
        .max(100, { message: 'Email deve ter no máximo 100 caracteres' }),
    senha: z.string()
        .min(8, { message: 'Senha deve ter pelo menos 8 caracteres' })
        .max(64, { message: 'Senha deve ter no máximo 64 caracteres' }),
});

module.exports = barbeariaSchema; 
