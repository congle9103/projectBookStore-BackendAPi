import express from "express";
import { loginStaff, loginCustomer } from "../../controllers/auth.controller";

const router = express.Router();

// Đăng nhập nhân viên
router.post("/staff/login", loginStaff);

// Đăng nhập khách hàng
router.post("/customer/login", loginCustomer);

export default router;
