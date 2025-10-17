import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service";
import { sendJsonSuccess } from "../helpers/response.helper";

/* ===========================
   🔹 HOME PRODUCTS (Giới hạn theo catId + limit)
   =========================== */
const findHomeProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productService.findHomeProducts({
      catId: req.params.catId,
      limit: req.query.limit ? parseInt(req.query.limit as string) : 5,
    });
    sendJsonSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

/* ===========================
   🔹 FIND ALL (có phân trang, lọc tên, giá, thể loại)
   =========================== */
const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const products = await productService.findAll(req.query);
    sendJsonSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

/* ===========================
   🔹 FIND BY ID
   =========================== */
const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.findById(id);
    sendJsonSuccess(res, product);
  } catch (error) {
    next(error);
  }
}

/* ===========================
   🔹 UPDATE BY ID
   =========================== */
const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.updateById(id, req.body);
    sendJsonSuccess(res, product, "Product updated successfully");
  } catch (error) {
    next(error);
  }
};

// Create a new product
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // ✅ Lấy đường dẫn file upload
    const filePath = req.file ? `uploads/${req.file.filename}` : null;

    // ✅ Trộn dữ liệu sản phẩm và thumbnail
    const productData = {
      ...req.body,
      thumbnail: filePath, // Lưu đường dẫn file
    };

    const product = await productService.create(productData);

    sendJsonSuccess(res, product, "Product created successfully");
  } catch (error) {
    next(error);
  }
};

/* ===========================
   🔹 DELETE BY ID
   =========================== */
const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const product = await productService.deleteById(id);
    sendJsonSuccess(res, product, "Product deleted successfully");
  } catch (error) {
    next(error);
  }
};

/* ===========================
   🔹 EXPORT CONTROLLER
   =========================== */
export default {
  findAll,
  findById,
  updateById,
  create,
  deleteById,
  findHomeProducts,
};
