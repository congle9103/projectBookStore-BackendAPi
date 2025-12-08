import { Router } from "express";
import productController from "../../controllers/product.controller";
import multer from "multer";
import path from "path";
import { verifyToken } from "../../middlewares/verifyToken.middleware";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    console.log("file:", file);

    const uniqueSuffix = Math.random().toString(36).substring(2, 10); // tạo chuỗi ngắn, ngẫu nhiên
    const ext = path.extname(file.originalname); // .jpg
    const baseName = path
      .basename(file.originalname, ext) // qua-chuoi
      .toLowerCase()
      .replace(/\s+/g, "-") // thay khoảng trắng = dấu -
      .replace(/[^a-z0-9\-]/g, ""); // bỏ ký tự đặc biệt
    cb(null, `${baseName}-${uniqueSuffix}${ext}`);
  },
});

const upload = multer({ storage });

const router = Router();

// GET /api/v1/products/client
router.get("/client", productController.findAllClient);

// GET /api/v1/products/client/tags/:tag
router.get("/client/tags/:tag", productController.findByCategoryTagsClient);

// GET /api/v1/products/client/category/:slug
router.get("/client/:slugCategory", productController.findByCategorySlugClient);

// Get productDetails by slug for client
router.get(
  "/client/:slugCategory/:slugDetails",
  productController.findBySlugClient
);

// GET /api/v1/products
router.get(
  "/",
  verifyToken,
  authorizeRole("admin", "product manager"),
  productController.findAll
);

// GET /api/v1/products/:id
router.get(
  "/:id",
  verifyToken,
  authorizeRole("admin", "product manager"),
  productController.findById
);

// POST /api/v1/products
router.post(
  "/",
  verifyToken,
  authorizeRole("admin", "product manager"),
  upload.single("thumbnail"),
  productController.create
);

// PUT /api/v1/products/:id
router.put(
  "/:id",
  verifyToken,
  authorizeRole("admin", "product manager"),
  upload.single("thumbnail"),
  productController.updateById
);

// DELETE /api/v1/products/:id
router.delete(
  "/:id",
  verifyToken,
  authorizeRole("admin", "product manager"),
  productController.deleteById
);

export default router;
