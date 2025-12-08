import { Router } from "express";
import supplierController from "../../controllers/supplier.controller";
import { verifyToken } from "../../middlewares/verifyToken.middleware";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware";

const router = Router();

router.get("/client", supplierController.findAllClient);

router.get("/", verifyToken, authorizeRole("admin", "product manager"), supplierController.findAll);

router.get("/:id", verifyToken, authorizeRole("admin", "product manager"), supplierController.findById);

router.post("/", verifyToken, authorizeRole("admin", "product manager"), supplierController.create);

router.put("/:id", verifyToken, authorizeRole("admin", "product manager"), supplierController.updateById);

router.delete("/:id", verifyToken, authorizeRole("admin", "product manager"), supplierController.deleteById);

export default router;