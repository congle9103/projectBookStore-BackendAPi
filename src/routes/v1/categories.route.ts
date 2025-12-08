import { Router } from "express";
import categoryController from "../../controllers/category.controller";
import { verifyToken } from "../../middlewares/verifyToken.middleware";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware";
import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    console.log("file:", file);
    
    const uniqueSuffix = Math.random().toString(36).substring(2, 10); // tạo chuỗi ngắn, ngẫu nhiên
    const ext = path.extname(file.originalname); // .jpg
    const baseName = path.basename(file.originalname, ext) // qua-chuoi
      .toLowerCase()
      .replace(/\s+/g, "-") // thay khoảng trắng = dấu -
      .replace(/[^a-z0-9\-]/g, ""); // bỏ ký tự đặc biệt
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();

// GET /api/v1/categories/client
router.get("/client", categoryController.findAllbyClient);

// GET /api/v1/categories
router.get("/", verifyToken, authorizeRole("admin", "product manager"), categoryController.findAll);

// GET /api/v1/categories/:id
router.get("/:id", verifyToken, authorizeRole("admin", "product manager"), categoryController.findById);

// POST /api/v1/categories
router.post("/", verifyToken, authorizeRole("admin", "product manager"),upload.single("thumbnail"), categoryController.create);

// PUT /api/v1/categories/:id
router.put("/:id", verifyToken, authorizeRole("admin", "product manager"),upload.single("thumbnail"), categoryController.updateById);

// DELETE /api/v1/categories/:id
router.delete("/:id", verifyToken, authorizeRole("admin", "product manager"), categoryController.deleteById);

export default router;
