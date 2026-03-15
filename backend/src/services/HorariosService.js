const INTERVALO_MINUTOS = 15;

function parseTimeToMinutes(time) {
  const [h, m] = time.trim().split(':').map(Number);
  if (isNaN(h) || isNaN(m) || h < 0 || h > 23 || m < 0 || m > 59) {
    throw new Error(`Horário inválido: ${time}. Use formato HH:mm.`);
  }
  return h * 60 + m;
}

function minutesToTimeString(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

const BR_UTC_OFFSET_HOURS = 3;

function dateToMinutes(date) {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}

function dateToMinutesBrazil(date) {
  const utcMs = date.getTime();
  const brazilMs = utcMs + BR_UTC_OFFSET_HOURS * 60 * 60 * 1000;
  const d = new Date(brazilMs);
  return (d.getUTCHours() * 60 + d.getUTCMinutes()) % (24 * 60);
}

function intervalosSeSobrepoem(start1, end1, start2, end2) {
  return start1 < end2 && start2 < end1;
}

function getHorariosDisponiveis({ tenant, servico, agendamentosDoDia }) {
  const aberturaStr = tenant.horarioAbertura || '09:00';
  const fechamentoStr = tenant.horarioFechamento || '18:00';
  const aberturaMin = parseTimeToMinutes(aberturaStr);
  const fechamentoMin = parseTimeToMinutes(fechamentoStr);
  const duracao = Number(servico.duracao);

  if (duracao <= 0 || duracao > 24 * 60) {
    throw new Error('Duração do serviço inválida.');
  }
  if (aberturaMin >= fechamentoMin) {
    throw new Error('Horário de abertura deve ser anterior ao fechamento.');
  }

  const ocupados = agendamentosDoDia.map((ag) => {
    const start = dateToMinutesBrazil(ag.dataHora);
    const duracaoAg = Number(ag.servico?.duracao ?? 0);
    return { start, end: start + duracaoAg };
  });

  const horarios = [];
  for (let slotMin = aberturaMin; slotMin < fechamentoMin; slotMin += INTERVALO_MINUTOS) {
    const slotEndMin = slotMin + duracao;
    if (slotEndMin > fechamentoMin) break;

    const colide = ocupados.some(({ start, end }) =>
      intervalosSeSobrepoem(slotMin, slotEndMin, start, end)
    );
    if (!colide) {
      horarios.push(minutesToTimeString(slotMin));
    }
  }

  return horarios;
}

module.exports = {
  getHorariosDisponiveis,
  parseTimeToMinutes,
  minutesToTimeString,
  dateToMinutes,
  intervalosSeSobrepoem,
  INTERVALO_MINUTOS,
};
