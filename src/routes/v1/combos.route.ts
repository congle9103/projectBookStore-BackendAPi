import { Router } from "express";
import comboController from "../../controllers/combo.controller";

const router = Router();

// GET /api/v1/combos
router.get("/", comboController.findAll);

// GET /api/v1/combos/:id
router.get("/:id", comboController.findById);

// POST /api/v1/combos
router.post("/", comboController.create);

// PUT /api/v1/combos/:id
router.put("/:id", comboController.updateById);

// DELETE /api/v1/combos/:id
router.delete("/:id", comboController.deleteById);

export default router;
