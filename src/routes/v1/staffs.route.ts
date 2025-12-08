import { Router } from "express";
import staffController from "../../controllers/staff.controller";
import { verifyToken } from "../../middlewares/verifyToken.middleware";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware";

const router = Router();

// 🔒 Chỉ admin và product manager mới được xem toàn bộ nhân viên
router.get("/", verifyToken, authorizeRole("admin", "product manager"), staffController.findAll);

// 🔒 Admin và product manager đều có thể xem chi tiết
router.get("/:id", verifyToken, authorizeRole("admin", "product manager"), staffController.findById);
    
// 🔒 Chỉ admin và product manager mới được thêm
router.post("/", verifyToken, authorizeRole("admin", "product manager"), staffController.create);

// 🔒 Chỉ admin và product manager mới được sửa nhân viên
router.put("/:id", verifyToken, authorizeRole("admin", "product manager"), staffController.updateById);

// 🔒 Chỉ admin và product manager mới được xoá nhân viên
router.delete("/:id", verifyToken, authorizeRole("admin", "product manager"), staffController.deleteById);

export default router;
