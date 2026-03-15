const prisma = require('../config/db');

class ConfiguracaoController {
    async atualizarConfiguracoes(req, res) {
        try {
            const tenantId = req.usuario?.tenantId;
            if (!tenantId) {
                return res.status(401).json({ erro: 'Token inválido ou sem tenant.' });
            }

            const { logoUrl, nomeBarbearia, horarioAbertura, horarioFechamento } = req.body;
            const data = {};
            if (logoUrl !== undefined) data.logoUrl = logoUrl || null;
            if (nomeBarbearia !== undefined) data.nome = nomeBarbearia;
            if (horarioAbertura !== undefined) data.horarioAbertura = horarioAbertura || '09:00';
            if (horarioFechamento !== undefined) data.horarioFechamento = horarioFechamento || '18:00';

            if (Object.keys(data).length === 0) {
                return res.status(400).json({ erro: 'Envie ao menos um campo para atualizar (logoUrl, nomeBarbearia, horarioAbertura ou horarioFechamento).' });
            }

            const tenantAtualizado = await prisma.tenant.update({
                where: { id: tenantId },
                data
            });

            return res.json({
                mensagem: 'Configurações atualizadas com sucesso!',
                tenant: tenantAtualizado
            });
        } catch (error) {
            console.error('ConfiguracaoController.atualizarConfiguracoes:', error);
            return res.status(500).json({
                erro: 'Erro ao salvar configurações.',
                detalhe: error.message
            });
        }
    }

    async buscarConfiguracoes(req, res) {
        try {
            const tenantId = req.usuario.tenantId;
            const tenant = await prisma.tenant.findUnique({
                where: { id: tenantId }
            });

            if (!tenant) {
                return res.status(404).json({ erro: 'Barbearia não encontrada.' });
            }

            return res.json(tenant);
        } catch (error) {
            return res.status(500).json({ erro: 'Erro ao buscar configurações.' });
        }
    }
}

module.exports = new ConfiguracaoController();
