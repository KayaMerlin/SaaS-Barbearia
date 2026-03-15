const prisma = require('../config/db');
const jwt = require('jsonwebtoken');

class AuthService {
    async executarLogin(email, senha) {
        const usuario = await prisma.user.findUnique({
            where: { email: email }
        });

        if (!usuario || usuario.senha !== senha) {
            throw new Error("Email ou senha inválidos");
        }

        const token = jwt.sign(
            { id: usuario.id, tenantId: usuario.tenantId },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        return token;
    }
}

module.exports = new AuthService();

