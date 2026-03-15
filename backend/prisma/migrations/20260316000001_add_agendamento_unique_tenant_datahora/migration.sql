-- CreateIndex
CREATE UNIQUE INDEX "Agendamento_tenantId_dataHora_key" ON "Agendamento"("tenantId", "dataHora");
