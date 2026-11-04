import type { Request, Response, NextFunction } from "express";
import * as inventoryTransactionService from "../services/inventory-transaction.service.js";
import { createInventoryTransactionSchema } from "../validations/inventory-transaction.validation.js";

export const createDraft = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.companyId) {
      return res.status(401).json({
        success: false,
        message: "Tenant context is missing"
      });
    }

    const input = createInventoryTransactionSchema.parse(req.body);

    const transaction = await inventoryTransactionService.createDraft(
      req.companyId,
      input
    );

    return res.status(201).json({
      success: true,
      message: "Inventory transaction draft created",
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};

export const findById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    if (!req.companyId) {
      return res.status(401).json({
        success: false,
        message: "Tenant context is missing"
      });
    }

    const transaction = await inventoryTransactionService.findById(
      req.companyId,
      req.params.transactionId as string
    );

    return res.status(200).json({
      success: true,
      data: transaction
    });
  } catch (error) {
    next(error);
  }
};