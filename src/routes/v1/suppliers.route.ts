import { Router } from "express";
import supplierController from "../../controllers/supplier.controller";

const router = Router();

router.get("/", supplierController.findAll);
router.get("/:id", supplierController.findById);
router.post("/", supplierController.create);
router.put("/:id", supplierController.updateById);
router.delete("/:id", supplierController.deleteById);

export default router;