import { Router } from "express";
import categoryController from "../../controllers/category.controller";

const router = Router();

// GET /api/v1/categories
router.get("/", categoryController.findAll);

// GET /api/v1/categories/:id
router.get("/:id", categoryController.findById);

// POST /api/v1/categories
router.post("/", categoryController.create);

// PUT /api/v1/categories/:id
router.put("/:id", categoryController.updateById);

// DELETE /api/v1/categories/:id
router.delete("/:id", categoryController.deleteById);

export default router;
