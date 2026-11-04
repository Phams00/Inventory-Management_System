import * as inventoryTransactionRepository from "../repositories/inventory-transaction.repository.js";
import type { CreateInventoryTransactionInput } from "../validations/inventory-transaction.validation.js";

export const createDraft = async (
  companyId: string,
  input: CreateInventoryTransactionInput
) => {
  return inventoryTransactionRepository.createDraft(companyId, input);
};

export const findById = async (
  companyId: string,
  transactionId: string
) => {
  const transaction = await inventoryTransactionRepository.findById(
    companyId,
    transactionId
  );

  if (!transaction) {
    throw new Error("Inventory transaction not found");
  }

  return transaction;
};