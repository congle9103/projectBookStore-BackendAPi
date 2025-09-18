import { Router } from "express";
import voucherController from "../../controllers/voucher.controller";

const router = Router();

// GET /api/v1/vouchers
router.get("/", voucherController.findAll);

// GET /api/v1/vouchers/:id
router.get("/:id", voucherController.findById);

// POST /api/v1/vouchers
router.post("/", voucherController.create);

// PUT /api/v1/vouchers/:id
router.put("/:id", voucherController.updateById);

// DELETE /api/v1/vouchers/:id
router.delete("/:id", voucherController.deleteById);

export default router;
