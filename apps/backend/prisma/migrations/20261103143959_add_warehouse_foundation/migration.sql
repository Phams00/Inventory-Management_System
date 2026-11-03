/*
  Warnings:

  - A unique constraint covering the columns `[id,companyId]` on the table `items` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "WarehouseLocationType" AS ENUM ('STORAGE', 'RECEIVING', 'SHIPPING', 'PRODUCTION', 'QUARANTINE', 'TRANSIT');

-- CreateTable
CREATE TABLE "warehouses" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "warehouse_locations" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "WarehouseLocationType" NOT NULL DEFAULT 'STORAGE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "warehouse_locations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_balances" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "warehouseId" UUID NOT NULL,
    "locationId" UUID NOT NULL,
    "itemId" UUID NOT NULL,
    "quantity" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "reservedQuantity" DECIMAL(18,3) NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "inventory_balances_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "warehouses_companyId_isActive_idx" ON "warehouses"("companyId", "isActive");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_id_companyId_key" ON "warehouses"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouses_companyId_code_key" ON "warehouses"("companyId", "code");

-- CreateIndex
CREATE INDEX "warehouse_locations_companyId_warehouseId_idx" ON "warehouse_locations"("companyId", "warehouseId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_locations_id_warehouseId_companyId_key" ON "warehouse_locations"("id", "warehouseId", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "warehouse_locations_warehouseId_code_key" ON "warehouse_locations"("warehouseId", "code");

-- CreateIndex
CREATE INDEX "inventory_balances_companyId_itemId_idx" ON "inventory_balances"("companyId", "itemId");

-- CreateIndex
CREATE INDEX "inventory_balances_companyId_warehouseId_locationId_idx" ON "inventory_balances"("companyId", "warehouseId", "locationId");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_balances_companyId_warehouseId_locationId_itemId_key" ON "inventory_balances"("companyId", "warehouseId", "locationId", "itemId");

-- CreateIndex
CREATE UNIQUE INDEX "items_id_companyId_key" ON "items"("id", "companyId");

-- AddForeignKey
ALTER TABLE "warehouses" ADD CONSTRAINT "warehouses_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "warehouse_locations" ADD CONSTRAINT "warehouse_locations_warehouseId_companyId_fkey" FOREIGN KEY ("warehouseId", "companyId") REFERENCES "warehouses"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_itemId_companyId_fkey" FOREIGN KEY ("itemId", "companyId") REFERENCES "items"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory_balances" ADD CONSTRAINT "inventory_balances_locationId_warehouseId_companyId_fkey" FOREIGN KEY ("locationId", "warehouseId", "companyId") REFERENCES "warehouse_locations"("id", "warehouseId", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
