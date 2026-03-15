const prisma = require('../config/db');

class BarbeariaService {
    async criarBarbearia(nomeBarbearia, nomeUsuario, email, senha) {
        const novaBarbearia = await prisma.tenant.create({
            data: {
                nome: nomeBarbearia,
                ativo: true,
                createdAt: new Date(),
                users: {
                    create: {
                        nome: nomeUsuario,
                        email: email,
                        senha: senha
                    }
                }
            },
            include: {
                users: true
            }
        });

        return novaBarbearia;
    }
}

module.exports = new BarbeariaService();

