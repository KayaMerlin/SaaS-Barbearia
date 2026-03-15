const servicoService = require('../services/ServicoService');

const ServicoController = {
    async criar(req, res) {
        try {
            const { nome, preco, duracao } = req.body;
            const novoServico = await servicoService.criarServico(
                { nome, preco, duracao },
                req.usuario.tenantId
            );
            res.status(201).json(novoServico);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    },

    async listar(req, res) {
        try {
            const servicos = await servicoService.listarServicos(req.usuario.tenantId);
            res.json(servicos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }
};

module.exports = ServicoController;

