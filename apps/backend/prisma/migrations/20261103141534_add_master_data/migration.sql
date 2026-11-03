-- CreateEnum
CREATE TYPE "ItemType" AS ENUM ('RAW_MATERIAL', 'WORK_IN_PROCESS', 'MRO', 'FINISHED_GOOD');

-- CreateTable
CREATE TABLE "item_categories" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "item_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "units_of_measure" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "symbol" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "units_of_measure_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items" (
    "id" UUID NOT NULL,
    "companyId" UUID NOT NULL,
    "categoryId" UUID NOT NULL,
    "unitId" UUID NOT NULL,
    "sku" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "itemType" "ItemType" NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "items_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "item_categories_companyId_idx" ON "item_categories"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "item_categories_id_companyId_key" ON "item_categories"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "item_categories_companyId_name_key" ON "item_categories"("companyId", "name");

-- CreateIndex
CREATE INDEX "units_of_measure_companyId_idx" ON "units_of_measure"("companyId");

-- CreateIndex
CREATE UNIQUE INDEX "units_of_measure_id_companyId_key" ON "units_of_measure"("id", "companyId");

-- CreateIndex
CREATE UNIQUE INDEX "units_of_measure_companyId_code_key" ON "units_of_measure"("companyId", "code");

-- CreateIndex
CREATE INDEX "items_companyId_categoryId_idx" ON "items"("companyId", "categoryId");

-- CreateIndex
CREATE INDEX "items_companyId_unitId_idx" ON "items"("companyId", "unitId");

-- CreateIndex
CREATE INDEX "items_companyId_itemType_idx" ON "items"("companyId", "itemType");

-- CreateIndex
CREATE UNIQUE INDEX "items_companyId_sku_key" ON "items"("companyId", "sku");

-- AddForeignKey
ALTER TABLE "item_categories" ADD CONSTRAINT "item_categories_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "units_of_measure" ADD CONSTRAINT "units_of_measure_companyId_fkey" FOREIGN KEY ("companyId") REFERENCES "companies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_categoryId_companyId_fkey" FOREIGN KEY ("categoryId", "companyId") REFERENCES "item_categories"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items" ADD CONSTRAINT "items_unitId_companyId_fkey" FOREIGN KEY ("unitId", "companyId") REFERENCES "units_of_measure"("id", "companyId") ON DELETE RESTRICT ON UPDATE CASCADE;
