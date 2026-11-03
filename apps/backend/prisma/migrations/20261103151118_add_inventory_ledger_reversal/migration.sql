-- CreateEnum
CREATE TYPE "InventoryTransactionType" AS ENUM ('RECEIPT', 'ISSUE', 'TRANSFER', 'ADJUSTMENT', 'PRODUCTION_ISSUE', 'PRODUCTION_RECEIPT', 'RETURN');

-- CreateEnum
CREATE TYPE "InventoryTransactionStatus" AS ENUM ('DRAFT', 'POSTED', 'REVERSED');

-- CreateTable
CREATE TABLE "inventory_transactions" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "transactionNo" TEXT NOT NULL,
    "type" "InventoryTransactionType" NOT NULL,
    "status" "InventoryTransactionStatus" NOT NULL DEFAULT 'DRAFT',
    "transactionDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reference" TEXT,
    "notes" TEXT,
    "postedAt" TIMESTAMP(3),
    "reversalOfId" UUID,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_ledger" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantityDelta" DECIMAL(18,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_ledger_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_transactions_companyId_type_status_idx" ON "inventory_transactions"("companyId", "type", "status");

-- CreateIndex
CREATE INDEX "inventory_transactions_companyId_transactionDate_idx" ON "inventory_transactions"("companyId", "transactionDate");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transactions_id_companyId_key" ON "inventory_transactions"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transactions_companyId_transactionNo_key" ON "inventory_transactions"("companyId", "transactionNo");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_transactions_reversalOfId_companyId_key" ON "inventory_transactions"("reversalOfId", "companyId");

-- CreateIndex
CREATE INDEX "inventory_ledger_companyId_itemId_createdAt_idx" ON "inventory_ledger"("companyId", "itemId", "createdAt");

-- CreateIndex
CREATE INDEX "inventory_ledger_companyId_warehouseId_locationId_idx" ON "inventory_ledger"("companyId", "warehouseId", "locationId");

-- CreateIndex
CREATE INDEX "inventory_ledger_transactionId_companyId_idx" ON "inventory_ledger"("transactionId", "companyId");

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transactions" ADD CONSTRAINT "inventory_transactions_reversalOfId_companyId_fkey" FOREIGN KEY ("reversalOfId", "companyId") REFERENCES "inventory_transactions"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger" ADD CONSTRAINT "inventory_ledger_transactionId_companyId_fkey" FOREIGN KEY ("transactionId", "companyId") REFERENCES "inventory_transactions"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger" ADD CONSTRAINT "inventory_ledger_itemId_companyId_fkey" FOREIGN KEY ("itemId", "companyId") REFERENCES "items"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_ledger" ADD CONSTRAINT "inventory_ledger_locationId_warehouseId_companyId_fkey" FOREIGN KEY ("locationId", "warehouseId", "companyId") REFERENCES "warehouse_locations"("id", "warehouseId", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
