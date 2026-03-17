const prisma = require('../config/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

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

    async gerarCodigoRecuperacao(telefone) {
        const telefoneLimpo = String(telefone).replace(/\D/g, '');
        if (!telefoneLimpo) {
            throw new Error("Telefone é obrigatório");
        }

        const usuario = await prisma.user.findFirst({
            where: { telefone: telefoneLimpo }
        });

        if (!usuario) {
            throw new Error("Usuário não encontrado para este telefone");
        }

        const codigo = crypto.randomInt(0, 10000).toString().padStart(4, '0');
        const expiracao = new Date(Date.now() + 15 * 60 * 1000);

        await prisma.user.update({
            where: { id: usuario.id },
            data: {
                codigoRecuperacao: codigo,
                codigoExpiracao: expiracao
            }
        });

        const url = process.env.LEMBRETE_WHATSAPP_URL?.trim();
        const token = process.env.LEMBRETE_WHATSAPP_TOKEN?.trim();

        if (url && token) {
            const numeroFinal = telefoneLimpo.startsWith('55') ? telefoneLimpo : '55' + telefoneLimpo;
            const texto = `Seu código de recuperação do BarberSaaS é: ${codigo}`;
            await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': token
                },
                body: JSON.stringify({ number: numeroFinal, text: texto })
            });
        }

        return true;
    }

    async resetarSenha(telefone, codigo, novaSenha) {
        const telefoneLimpo = String(telefone).replace(/\D/g, '');
        if (!telefoneLimpo || !codigo || !novaSenha) {
            throw new Error("Dados inválidos");
        }

        const usuario = await prisma.user.findFirst({
            where: { telefone: telefoneLimpo }
        });

        if (!usuario || !usuario.codigoRecuperacao || !usuario.codigoExpiracao) {
            throw new Error("Código inválido");
        }

        const agora = new Date();
        if (usuario.codigoRecuperacao !== codigo) {
            throw new Error("Código inválido");
        }

        if (usuario.codigoExpiracao.getTime() < agora.getTime()) {
            throw new Error("Código expirado");
        }

        const hash = await bcrypt.hash(novaSenha, 10);

        await prisma.user.update({
            where: { id: usuario.id },
            data: {
                senha: hash,
                codigoRecuperacao: null,
                codigoExpiracao: null
            }
        });

        return true;
    }
}

module.exports = new AuthService();