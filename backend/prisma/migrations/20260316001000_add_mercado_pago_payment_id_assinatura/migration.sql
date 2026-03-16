-- AlterTable
ALTER TABLE "PagamentoAssinatura" ADD COLUMN "mercadoPagoPaymentId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "PagamentoAssinatura_mercadoPagoPaymentId_key" ON "PagamentoAssinatura"("mercadoPagoPaymentId");
