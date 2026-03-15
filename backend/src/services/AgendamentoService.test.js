const mockPrisma = {
    agendamento: {
        findFirst: jest.fn(),
        update: jest.fn(),
    },
};

jest.mock('../config/db', () => mockPrisma);

const agendamentoService = require('./AgendamentoService');

describe('AgendamentoService - Atualizar Status', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('Deve atualizar o status com sucesso se o agendamento pertencer à barbearia', async () => {
        mockPrisma.agendamento.findFirst.mockResolvedValue({
            id: '123',
            tenantId: 'tenant-marcos',
        });
        mockPrisma.agendamento.update.mockResolvedValue({
            id: '123',
            status: 'CONCLUIDO',
        });

        const resultado = await agendamentoService.atualizarStatus(
            '123',
            'tenant-marcos',
            'CONCLUIDO'
        );

        expect(resultado.status).toBe('CONCLUIDO');
        expect(mockPrisma.agendamento.findFirst).toHaveBeenCalledTimes(1);
        expect(mockPrisma.agendamento.update).toHaveBeenCalledTimes(1);
    });

    it('Deve dar erro (Throw) se o agendamento for de OUTRA barbearia', async () => {
        mockPrisma.agendamento.findFirst.mockResolvedValue(null);

        await expect(
            agendamentoService.atualizarStatus(
                '123',
                'tenant-invasor',
                'CANCELADO'
            )
        ).rejects.toThrow(
            'Agendamento não encontrado ou não pertence a esta barbearia.'
        );

        expect(mockPrisma.agendamento.update).not.toHaveBeenCalled();
    });
});
