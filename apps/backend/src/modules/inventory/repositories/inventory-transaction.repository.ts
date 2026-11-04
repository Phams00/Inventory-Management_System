
import { prisma } from "../../../config/database.js";
import type { CreateInventoryTransactionInput } from "../validations/inventory-transaction.validation.js";

// ==========================================
// CREATE INVENTORY TRANSACTION
// ==========================================

export const createDraft = async (
  companyId: string,
  input: CreateInventoryTransactionInput
) => {
  return prisma.$transaction(async (tx) => {
    // 1. Create transaction header
    const transaction = await tx.inventoryTransaction.create({
      data: {
        companyId,
        transactionNo: input.transactionNo,
        type: input.type,
        transactionDate: input.transactionDate,
        reference: input.reference,
        notes: input.notes
      }
    });

    // 2. Create transaction lines
    await tx.inventoryTransactionLine.createMany({
      data: input.items.map((item) => ({
        companyId,
        transactionId: transaction.id,
        warehouseId: item.warehouseId,
        locationId: item.locationId,
        itemId: item.itemId,
        quantity: item.quantity
      }))
    });

    // 3. Return transaction with its lines
    return tx.inventoryTransaction.findFirst({
      where: {
        id: transaction.id,
        companyId
      },
      include: {
        transactionLines: true
      }
    });
  });
};

// ==========================================
// FIND INVENTORY TRANSACTION BY ID
// ==========================================

export const findById = async (
  companyId: string,
  transactionId: string
) => {
  return prisma.inventoryTransaction.findFirst({
    where: {
      id: transactionId,
      companyId
    },
    include: {
      transactionLines: true,
      ledgerEntries: true
    }
  });
};
