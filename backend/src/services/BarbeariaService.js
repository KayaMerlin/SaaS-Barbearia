const prisma = require('../config/db');
const bcrypt = require('bcryptjs');

function slugify(text) {
    return text
        .toLowerCase()
        .trim()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .slice(0, 50) || 'barbearia';
}

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

        const slugBase = slugify(nomeBarbearia);
        const sufixo = novaBarbearia.id.replace(/-/g, '').substring(0, 8);
        const slug = `${slugBase}-${sufixo}`;

        await prisma.tenant.update({
            where: { id: novaBarbearia.id },
            data: { slug }
        });

        return { ...novaBarbearia, slug };
    }
}

module.exports = new BarbeariaService();

