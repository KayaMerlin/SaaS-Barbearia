const { getHorariosDisponiveis, intervalosSeSobrepoem } = require('./HorariosService');

describe('Horários de atendimento no Brasil (UTC-3)', () => {
  const tenant = { horarioAbertura: '09:00', horarioFechamento: '12:00' };
  const servico = { duracao: 30 };

  test('converte corretamente a reserva em UTC para 10h de Brasília e bloqueia a duração completa', () => {
    const horarios = getHorariosDisponiveis({
      tenant,
      servico,
      agendamentosDoDia: [{
        dataHora: new Date('2026-11-27T13:00:00.000Z'), // 10h em Brasília
        servico: { duracao: 60 },
      }],
    });

    expect(horarios).toContain('09:30');
    expect(horarios).not.toContain('09:45');
    expect(horarios).not.toContain('10:00');
    expect(horarios).not.toContain('10:30');
    expect(horarios).toContain('11:00');
  });

  test('não produz horários que ultrapassem o fechamento', () => {
    const horarios = getHorariosDisponiveis({ tenant, servico: { duracao: 45 }, agendamentosDoDia: [] });
    expect(horarios).toContain('11:15');
    expect(horarios).not.toContain('11:30');
  });

  test('trata horários adjacentes como não conflitantes', () => {
    expect(intervalosSeSobrepoem(9 * 60, 10 * 60, 10 * 60, 11 * 60)).toBe(false);
    expect(intervalosSeSobrepoem(9 * 60, 10 * 60, 9 * 60 + 30, 11 * 60)).toBe(true);
  });
});
