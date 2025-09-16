import express, { Request, Response, NextFunction } from "express";
import Product from "../../models/Product.model";
import createHttpError from "http-errors";

const router = express.Router();

// GET products (lọc theo category + sort theo giá)
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { sort, category } = req.query;

    let filter: any = {};
    if (category) {
      filter.category_id = category; // category_id là ObjectId tham chiếu Category
    }

    let sortOption: any = {};
    if (sort === "asc") {
      sortOption = { price: 1 };
    } else if (sort === "desc") {
      sortOption = { price: -1 };
    }

    const products = await Product.find(filter)
      .select("-updatedAt -createdAt")
      .sort(sortOption);

    res.json(products);
  } catch (error: any) {
    next(error);
  }
});

router.get("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      throw createHttpError(404, "Product not found");
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body;
    const newProduct = new Product({
      title: payload.title,
      keyword: payload.keyword,
      description: payload.description,
      content: payload.content,
      date: payload.date,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (err) {
    next(err);
  }
});

export default router;
