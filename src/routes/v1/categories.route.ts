import express, { Request, Response, NextFunction } from "express";
import Category from "../../models/Category.model";
import createHttpError from "http-errors";

const router = express.Router();

// Lấy danh sách category
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    next(err);
  }
});

// Lấy chi tiết category theo id
router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      throw createHttpError(404, "Category not found");
    }
    res.json(category);
  } catch (err) {
    next(err);
  }
});

// Tạo mới category
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const newCategory = new Category({
      category_name: payload.category_name,
      description: payload.description,
      slug: payload.slug,
    });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (err) {
    next(err);
  }
});

export default router;
