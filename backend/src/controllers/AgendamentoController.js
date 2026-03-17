const agendamentoService = require('../services/AgendamentoService');

class AgendamentoController {
    async criar(req, res) {
        try {
            const { clienteId, servicoId, dataHora } = req.body;
            const tenantId = req.usuario.tenantId;

            const novoAgendamento = await agendamentoService.criarAgendamento(
                tenantId,
                clienteId,
                servicoId,
                dataHora
            );

            res.status(201).json(novoAgendamento);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async listarPorData(req, res) {
        try {
            const { data } = req.query;
            if (!data) {
                return res.status(400).json({ erro: 'Parâmetro de data é obrigatório (formato YYYY-MM-DD).' });
            }

            const tenantId = req.usuario.tenantId;
            const agendamentos = await agendamentoService.listarPorData(tenantId, data);

            res.json(agendamentos);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async atualizarStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const tenantId = req.usuario.tenantId;

            const agendamentoAtualizado = await agendamentoService.atualizarStatus(id, tenantId, status);

            res.json(agendamentoAtualizado);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }

    async resumoSemana(req, res) {
        try {
            const tenantId = req.usuario.tenantId;
            const dados = await agendamentoService.resumoSemana(tenantId);
            res.json(dados);
        } catch (error) {
            res.status(500).json({ erro: error.message });
        }
    }

    async finalizarPagamentoDinheiro(req, res) {
        try {
            const { id } = req.params;
            const tenantId = req.usuario.tenantId;
            const agendamento = await agendamentoService.finalizarPagamentoDinheiro(id, tenantId);
            res.json(agendamento);
        } catch (error) {
            res.status(400).json({ erro: error.message });
        }
    }
}

module.exports = new AgendamentoController();
