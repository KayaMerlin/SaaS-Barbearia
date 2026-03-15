-- DropForeignKey
ALTER TABLE "Agendamento" DROP CONSTRAINT "Agendamento_clienteId_fkey";

-- DropForeignKey
ALTER TABLE "Transacao" DROP CONSTRAINT "Transacao_agendamentoId_fkey";

-- AddForeignKey
ALTER TABLE "Agendamento" ADD CONSTRAINT "Agendamento_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE CASCADE ON UPDATE CASCADE;
