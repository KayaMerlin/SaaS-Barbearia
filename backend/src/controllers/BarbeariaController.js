const barbeariaService = require('../services/BarbeariaService');

class BarbeariaController {
    async criar(req, res) {
        try {
            const { nomeBarbearia, nomeUsuario, email, senha } = req.body;

            const novaBarbearia = await barbeariaService.criarBarbearia(
                nomeBarbearia,
                nomeUsuario,
                email,
                senha
            );

            res.status(201).json({
                mensagem: "Barbearia e Administrador criados com sucesso",
                dados: novaBarbearia
            });
        } catch (error) {
            const status = error.message === 'Já existe uma conta com este e-mail.' ? 400 : 500;
            res.status(status).json({
                mensagem: "Erro ao criar barbearia e administrador",
                erro: error.message
            });
        }
    }
}

module.exports = new BarbeariaController();

