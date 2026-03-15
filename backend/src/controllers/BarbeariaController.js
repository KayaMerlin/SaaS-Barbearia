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
            res.status(500).json({
                mensagem: "Erro ao criar barbearia e administrador",
                erro: error.message
            });
        }
    }
}

module.exports = new BarbeariaController();

