import { Router } from "express";
import * as inventoryTransactionController from "../controllers/inventory-transaction.controller.js";

const router = Router();

router.post("/", inventoryTransactionController.createDraft);
router.get("/:transactionId", inventoryTransactionController.findById);

export default router;