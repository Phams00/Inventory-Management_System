-- CreateTable
CREATE TABLE "inventory_transaction_lines" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "transactionId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_transaction_lines_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "inventory_transaction_lines_companyId_transactionId_idx" ON "inventory_transaction_lines"("companyId", "transactionId");

-- CreateIndex
CREATE INDEX "inventory_transaction_lines_companyId_itemId_idx" ON "inventory_transaction_lines"("companyId", "itemId");

-- AddForeignKey
ALTER TABLE "inventory_transaction_lines" ADD CONSTRAINT "inventory_transaction_lines_transactionId_companyId_fkey" FOREIGN KEY ("transactionId", "companyId") REFERENCES "inventory_transactions"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transaction_lines" ADD CONSTRAINT "inventory_transaction_lines_itemId_companyId_fkey" FOREIGN KEY ("itemId", "companyId") REFERENCES "items"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_transaction_lines" ADD CONSTRAINT "inventory_transaction_lines_locationId_warehouseId_company_fkey" FOREIGN KEY ("locationId", "warehouseId", "companyId") REFERENCES "warehouse_locations"("id", "warehouseId", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
