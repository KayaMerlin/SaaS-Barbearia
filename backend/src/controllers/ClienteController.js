const clienteService = require('../services/ClienteService');

class ClienteController {
    async criar(req, res) {
        try {
            const { nome, telefone } = req.body;
            const tenantId = req.usuario.tenantId;

            const novoCliente = await clienteService.criarCliente(nome, telefone, tenantId);

            res.status(201).json(novoCliente);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async listar(req, res) {
        try {
            const tenantId = req.usuario.tenantId;
            const clientes = await clienteService.listarClientes(tenantId);

            res.json(clientes);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async excluir(req, res) {
        try {
            const { id } = req.params;
            const tenantId = req.usuario.tenantId;

            await clienteService.excluirCliente(id, tenantId);
            res.status(204).send();
        } catch (error) {
            if (error.message === "Cliente não encontrado.") {
                return res.status(404).json({ erro: error.message });
            }
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new ClienteController();
