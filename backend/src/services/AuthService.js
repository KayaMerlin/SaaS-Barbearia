const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

class AuthService {
    async executarLogin(email, senha) {
        const usuario = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!usuario) {
            throw new Error("Email ou senha inválidos");
        }

        const senhaValida = usuario.senha.startsWith('$2')
            ? await bcrypt.compare(senha, usuario.senha)
            : senha === usuario.senha;

        if (!senhaValida) {
            throw new Error("Email ou senha inválidos");
        }

        const token = jwt.sign(
            { id: usuario.id, tenantId: usuario.tenantId, role: usuario.role || 'USER' },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return {
            token,
            usuario: {
                id: usuario.id,
                nome: usuario.nome,
                email: usuario.email,
                role: usuario.role || 'USER'
            }
        };
    }
}

module.exports = new AuthService();

