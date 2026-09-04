-- CreateEnum
CREATE TYPE "PaymentGateway" AS ENUM ('SSLCOMMERZ');

-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('INITIATED', 'VALID', 'FAILED', 'CANCELLED');

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" TEXT NOT NULL,
    "trxId" TEXT NOT NULL,
    "gateway" "PaymentGateway" NOT NULL DEFAULT 'SSLCOMMERZ',
    "userId" TEXT NOT NULL,
    "eventId" TEXT NOT NULL,
    "eventParticipantId" TEXT,
    "amount" DOUBLE PRECISION NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'BDT',
    "status" "TransactionStatus" NOT NULL DEFAULT 'INITIATED',
    "gatewayTransactionId" TEXT,
    "bankTransactionId" TEXT,
    "valId" TEXT,
    "cardType" TEXT,
    "storeAmount" DOUBLE PRECISION,
    "verifyPayload" JSONB,
    "successUrl" TEXT,
    "failUrl" TEXT,
    "cancelUrl" TEXT,
    "gatewayResponse" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_trxId_key" ON "PaymentTransaction"("trxId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_userId_idx" ON "PaymentTransaction"("userId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_eventId_idx" ON "PaymentTransaction"("eventId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_eventParticipantId_idx" ON "PaymentTransaction"("eventParticipantId");

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_eventParticipantId_fkey" FOREIGN KEY ("eventParticipantId") REFERENCES "EventParticipant"("id") ON DELETE SET NULL ON UPDATE CASCADE;
