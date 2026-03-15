-- CreateTable
CREATE TABLE "Transacao" (
    "id" TEXT NOT NULL,
    "agendamentoId" TEXT NOT NULL,
    "tenantId" TEXT NOT NULL,
    "valor" DECIMAL(10,2) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDENTE',
    "metodo" TEXT NOT NULL DEFAULT 'PIX',
    "codigoPix" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Transacao_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Transacao_agendamentoId_key" ON "Transacao"("agendamentoId");

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_agendamentoId_fkey" FOREIGN KEY ("agendamentoId") REFERENCES "Agendamento"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transacao" ADD CONSTRAINT "Transacao_tenantId_fkey" FOREIGN KEY ("tenantId") REFERENCES "Tenant"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
