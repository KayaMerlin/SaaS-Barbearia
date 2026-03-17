const authService = require('../services/AuthService');

class AuthController {
    async login(req, res) {
        try {
            const { email, senha } = req.body;
            const { token, usuario } = await authService.executarLogin(email, senha);

            res.json({
                mensagem: "Login realizado com sucesso!",
                token,
                usuario
            });
        } catch (error) {
            res.status(401).json({ erro: error.message });
        }
    }

    async esqueciSenha(req, res) {
        try {
            const { telefone } = req.body;
            await authService.gerarCodigoRecuperacao(telefone);
            res.json({ mensagem: "Código de recuperação enviado por WhatsApp" });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async resetarSenha(req, res) {
        try {
            const { telefone, codigo, novaSenha } = req.body;
            await authService.resetarSenha(telefone, codigo, novaSenha);
            res.json({ mensagem: "Senha atualizada com sucesso" });
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new AuthController();