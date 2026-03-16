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
}

module.exports = new AuthController();

