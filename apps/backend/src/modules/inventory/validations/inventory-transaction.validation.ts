
import { z } from "zod";

// ==========================================
// INVENTORY TRANSACTION ENUMS
// ==========================================

const inventoryTransactionTypeSchema = z.enum([
  "RECEIPT",
  "ISSUE",
  "TRANSFER",
  "ADJUSTMENT",
  "PRODUCTION_ISSUE",
  "PRODUCTION_RECEIPT",
  "RETURN"
]);

// ==========================================
// INVENTORY TRANSACTION ITEM
// ==========================================

const inventoryTransactionItemSchema = z.object({
  itemId: z.string().uuid(),
  warehouseId: z.string().uuid(),
  locationId: z.string().uuid(),
  quantity: z.number().positive()
});

// ==========================================
// CREATE INVENTORY TRANSACTION
// ==========================================

export const createInventoryTransactionSchema = z.object({
  transactionNo: z.string().trim().min(1).max(50),

  type: inventoryTransactionTypeSchema,

  transactionDate: z.coerce.date().optional(),

  reference: z.string().trim().max(100).optional(),

  notes: z.string().trim().max(1000).optional(),

  items: z.array(inventoryTransactionItemSchema).min(1)
});

// ==========================================
// TYPES
// ==========================================

export type CreateInventoryTransactionInput = z.infer<
  typeof createInventoryTransactionSchema
>;
