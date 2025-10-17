import { Router } from "express";
import productController from "../../controllers/product.controller";

import multer from "multer";

const upload = multer({ dest: "public/uploads/" });

const router = Router();

// GET /api/v1/products
router.get("/", productController.findAll);

// GET /api/v1/products/:id
router.get("/:id", productController.findById);

// POST /api/v1/products
router.post("/", upload.single("thumbnail"), productController.create);

// PUT /api/v1/products/:id
router.put("/:id", upload.single("thumbnail"), productController.updateById);

// DELETE /api/v1/products/:id
router.delete("/:id", productController.deleteById);

export default router;
