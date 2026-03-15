const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

class BarbeariaService {
    async criarBarbearia(nomeBarbearia, nomeUsuario, email, senha) {
        const senhaHash = await bcrypt.hash(senha, 10);

        const novaBarbearia = await prisma.tenant.create({
            data: {
                nome: nomeBarbearia,
                ativo: true,
                createdAt: new Date(),
                users: {
                    create: {
                        nome: nomeUsuario,
                        email: email,
                        senha: senhaHash
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

