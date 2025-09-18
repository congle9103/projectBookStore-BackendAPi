import { Router } from "express";
import staffController from "../../controllers/staff.controller";

const router = Router();

// GET /api/v1/staffs
router.get("/", staffController.findAll);

// GET /api/v1/staffs/:id
router.get("/:id", staffController.findById);

// POST /api/v1/staffs
router.post("/", staffController.create);

// PUT /api/v1/staffs/:id
router.put("/:id", staffController.updateById);

// DELETE /api/v1/staffs/:id
router.delete("/:id", staffController.deleteById);

export default router;
