-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN "mercadoPagoAccessToken" TEXT;

-- AlterTable
ALTER TABLE "Transacao" ADD COLUMN "mercadoPagoPaymentId" TEXT;

-- CreateUniqueIndex
CREATE UNIQUE INDEX "Transacao_mercadoPagoPaymentId_key" ON "Transacao"("mercadoPagoPaymentId");
