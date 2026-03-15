const crypto = require('crypto');
const prisma = require('../config/db');
const { getHorariosDisponiveis } = require('../services/HorariosService');

class PublicController {

    async _getTenantBySlug(slug) {
        let tenant = await prisma.tenant.findUnique({
            where: { slug }
        });
        if (tenant) return tenant.id;

        const tenants = await prisma.tenant.findMany();
        const nomeFormatado = slug.toLowerCase();
        const encontrado = tenants.find((t) => t.nome.toLowerCase().replace(/\s+/g, '-') === nomeFormatado);
        if (!encontrado) throw new Error("Barbearia não encontrada. Verifique o link.");
        return encontrado.id;
    }

    async _getTenantCompletoBySlug(slug) {
        let tenant = await prisma.tenant.findUnique({
            where: { slug }
        });
        if (tenant) return tenant;

        const tenants = await prisma.tenant.findMany();
        const nomeFormatado = slug.toLowerCase();
        const encontrado = tenants.find((t) => t.nome.toLowerCase().replace(/\s+/g, '-') === nomeFormatado);
        if (!encontrado) throw new Error("Barbearia não encontrada. Verifique o link.");
        return encontrado;
    }

    async listarServicos(req, res) {
        try {
            const tenantId = await this._getTenantBySlug(req.params.slug);

            const servicos = await prisma.servico.findMany({
                where: { tenantId }
            });

            res.json(servicos);
        } catch (error) {
            res.status(404).json({ erro: error.message });
        }
    }

    async criarAgendamento(req, res) {
        try {
            const tenantId = await this._getTenantBySlug(req.params.slug);
            const { servicoId, dataHora, nome, telefone } = req.body;

            if (!servicoId || !dataHora || !nome || !telefone) {
                return res.status(400).json({ erro: "servicoId, dataHora, nome e telefone são obrigatórios." });
            }

            const dataHoraDate = new Date(dataHora);
            if (dataHoraDate.getTime() < Date.now()) {
                return res.status(400).json({ erro: "Não é possível marcar no passado." });
            }

            const servico = await prisma.servico.findFirst({
                where: { id: servicoId, tenantId }
            });
            if (!servico) {
                return res.status(404).json({ erro: "Serviço não encontrado." });
            }

            const horarioOcupado = await prisma.agendamento.findFirst({
                where: {
                    tenantId,
                    dataHora: dataHoraDate,
                    status: { not: 'CANCELADO' }
                }
            });
            if (horarioOcupado) {
                return res.status(409).json({ erro: "Este horário já está reservado." });
            }

            const hashPix = crypto.randomBytes(16).toString('hex');
            const codigoPixSimulado = `00020126580014br.gov.bcb.pix0136${hashPix}5204000053039865802BR5913BarberSaaS...`;

            const resultado = await prisma.$transaction(async (tx) => {
                let cliente = await tx.cliente.findFirst({
                    where: { telefone, tenantId }
                });

                if (!cliente) {
                    cliente = await tx.cliente.create({
                        data: { nome, telefone, tenantId }
                    });
                }

                const agendamento = await tx.agendamento.create({
                    data: {
                        dataHora: dataHoraDate,
                        status: "AGUARDANDO_PAGAMENTO",
                        tenantId,
                        clienteId: cliente.id,
                        servicoId
                    }
                });

                const transacao = await tx.transacao.create({
                    data: {
                        agendamentoId: agendamento.id,
                        tenantId,
                        valor: servico.preco,
                        status: "PENDENTE",
                        metodo: "PIX",
                        codigoPix: codigoPixSimulado
                    }
                });

                return { agendamento, transacao };
            });

            res.status(201).json({
                mensagem: "Agendamento reservado! Realize o pagamento.",
                transacaoId: resultado.transacao.id,
                valor: resultado.transacao.valor,
                codigoPix: resultado.transacao.codigoPix
            });
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(409).json({
                    erro: "Que pena! Outro cliente acabou de reservar este horário. Por favor, escolha outro."
                });
            }
            res.status(400).json({ erro: error.message });
        }
    }

    async listarHorariosDisponiveis(req, res) {
        try {
            const { slug } = req.params;
            const { data, servicoId } = req.query;

            if (!data || !servicoId) {
                return res.status(400).json({
                    erro: 'Parâmetros data (YYYY-MM-DD) e servicoId são obrigatórios.',
                });
            }

            const dataRegex = /^\d{4}-\d{2}-\d{2}$/;
            if (!dataRegex.test(data)) {
                return res.status(400).json({ erro: 'Data inválida. Use o formato YYYY-MM-DD.' });
            }

            const dataObj = new Date(data + 'T12:00:00.000Z');
            if (Number.isNaN(dataObj.getTime())) {
                return res.status(400).json({ erro: 'Data inválida.' });
            }

            const hoje = new Date();
            hoje.setUTCHours(0, 0, 0, 0);
            const diaEscolhido = new Date(data + 'T00:00:00.000Z');
            if (diaEscolhido < hoje) {
                return res.status(400).json({ erro: 'Não é possível agendar em data passada.' });
            }

            const tenant = await this._getTenantCompletoBySlug(slug);
            const servico = await prisma.servico.findFirst({
                where: { id: servicoId, tenantId: tenant.id },
            });

            if (!servico) {
                return res.status(404).json({ erro: 'Serviço não encontrado.' });
            }

            const startOfDay = new Date(data + 'T00:00:00.000Z');
            const startOfNextDay = new Date(startOfDay);
            startOfNextDay.setUTCDate(startOfNextDay.getUTCDate() + 1);

            const agendamentosDoDia = await prisma.agendamento.findMany({
                where: {
                    tenantId: tenant.id,
                    dataHora: { gte: startOfDay, lt: startOfNextDay },
                    status: { not: 'CANCELADO' },
                },
                include: { servico: true },
            });

            const horarios = getHorariosDisponiveis({
                tenant: {
                    horarioAbertura: tenant.horarioAbertura,
                    horarioFechamento: tenant.horarioFechamento,
                },
                servico: { duracao: servico.duracao },
                agendamentosDoDia,
            });

            res.json(horarios);
        } catch (error) {
            if (error.message?.includes('Barbearia não encontrada') || error.message?.includes('Horário inválido')) {
                return res.status(400).json({ erro: error.message });
            }
            res.status(500).json({ erro: error.message || 'Erro ao calcular horários.' });
        }
    }
}

module.exports = new PublicController();
