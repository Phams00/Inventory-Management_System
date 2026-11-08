import { Router } from "express";

import * as inventoryTransactionController from "../controllers/inventory-transaction.controller.js";

import { authMiddleware } from "../../../middleware/auth.middleware.js";
import { tenantMiddleware } from "../../../middleware/tenant.middleware.js";

const router = Router();

// Semua endpoint membutuhkan autentikasi dan tenant aktif
router.use(authMiddleware);
router.use(tenantMiddleware);

// Inventory Transaction
router.post("/", inventoryTransactionController.createDraft);
router.get("/:transactionId", inventoryTransactionController.findById);

export default router;