const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

class AuthService {
    async executarLogin(email, senha) {
        const usuario = await prisma.user.findUnique({ where: { email } });
        if (!usuario) throw new Error("Email ou senha inválidos");

        const senhaValida = usuario.senha.startsWith('$2')
            ? await bcrypt.compare(senha, usuario.senha)
            : senha === usuario.senha;

        if (!senhaValida) throw new Error("Email ou senha inválidos");

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

    async gerarCodigoRecuperacao(email) {
        if (!email) throw new Error("E-mail é obrigatório");

        const usuario = await prisma.user.findUnique({ where: { email } });
        if (!usuario) throw new Error("Usuário não encontrado com este e-mail");

        const codigo = crypto.randomInt(0, 10000).toString().padStart(4, '0');
        const expiracao = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: usuario.id },
            data: { codigoRecuperacao: codigo, codigoExpiracao: expiracao }
        });

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        await transporter.sendMail({
            from: `"BarberSaaS" <${process.env.EMAIL_USER}>`,
            to: usuario.email,
            subject: 'Recuperação de Senha - BarberSaaS',
            text: `Olá, ${usuario.nome}!\n\nSeu código de recuperação de senha é: ${codigo}\n\nEle é válido por 15 minutos. Se não foi você quem solicitou, ignore este e-mail.`
        });

        return true;
    }

    async resetarSenha(email, codigo, novaSenha) {
        if (!email || !codigo || !novaSenha) throw new Error("Dados inválidos");

        const usuario = await prisma.user.findUnique({ where: { email } });

        if (!usuario || !usuario.codigoRecuperacao || !usuario.codigoExpiracao) {
            throw new Error("Código inválido ou expirado");
        }

        const agora = new Date();
        if (usuario.codigoRecuperacao !== codigo) throw new Error("Código incorreto");
        if (usuario.codigoExpiracao.getTime() < agora.getTime()) throw new Error("Código expirado");

        const hash = await bcrypt.hash(novaSenha, 10);

        await prisma.user.update({
            where: { id: usuario.id },
            data: { senha: hash, codigoRecuperacao: null, codigoExpiracao: null }
        });

        return true;
    }
}

module.exports = new AuthService();