const { z } = require('zod'); 

const servicoSchema = z.object({
    nome: z.string()
        .min(2, { message: 'Nome do serviço deve ter pelo menos 2 caracteres' })
        .max(100, { message: 'Nome do serviço deve ter no máximo 100 caracteres' })
        .regex(/^[a-zA-ZÀ-ÿ0-9\s\-\(\)\/\+\.,&']+$/, { message: 'Nome do serviço contém caracteres inválidos. Use letras, números, espaços, hífen, parênteses, barra, + , . &' }),
        
    preco: z.number()
        .positive({ message: 'Preço do serviço deve ser maior que zero' })
        .max(10000, { message: 'Preço do serviço deve ser menor que 10000' }),
        
    duracao: z.number()
        .int({ message: 'Duração do serviço deve ser um número inteiro (em minutos)' })
        .positive({ message: 'Duração do serviço deve ser maior que zero' })
        .max(1000, { message: 'Duração do serviço deve ser menor que 1000 minutos' }),
});

module.exports = servicoSchema;