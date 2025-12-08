import createError from "http-errors";
import { NextFunction, Request, Response } from "express";
import productService from "../services/product.service";
import { sendJsonSuccess } from "../helpers/response.helper";

/* ===========================
   🔹 FIND ALL PRODUCTS (không phân trang, không lọc, không sắp xếp)
   =========================== */
const findAllClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const products = await productService.findAllClient(req.query);
    sendJsonSuccess(res, products);
  } catch (error) {
    next(error);
  }
};

// Find by category slug client
const findBySlugClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { slugDetails } = req.params;
    const product = await productService.findBySlugClient(slugDetails);
    sendJsonSuccess(res, product);
  } catch (error) {
    next(error);
  }
};

// Find by category client
const findByCategorySlugClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { slugCategory } = req.params; // 👈 Phải trùng tên với router
    const { page = 1, limit = 10 } = req.query;

    console.log("✅ Slug từ client:", slugCategory);

    const result = await productService.findByCategorySlugClient(slugCategory, {
      page,
      limit,
    });

    res.status(200).json({
      statusCode: 200,
      message: "Get products by category slug success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

// Find by category tags client
const findByCategoryTagsClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    console.log("✅ Vào controller findByCategoryTagsClient");
    const { tag } = req.params;
    const products = await productService.findByCategoryTagsClient(tag, req.query);
    sendJsonSuccess(res, products);
  } catch (error) {
    console.log("❌ Lỗi ở controller findByCategoryTagsClient:", error);
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
};

/* ===========================
   🔹 UPDATE BY ID
   =========================== */
const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // ⚙️ Lấy các trường từ body
    const {
      product_name,
      category,
      supplier,
      publisher,
      authors,
      pages,
      publicationYear,
      format,
      dimensions,
      weight,
      originalPrice,
      discountPercent,
      stock,
      slug,
      description,
      isNew,
      isPopular,
      isFlashSale,
    } = req.body;

    const payload: any = {
      product_name,
      category,
      supplier,
      publisher,
      authors,
      pages,
      publicationYear,
      format,
      dimensions,
      weight,
      originalPrice,
      discountPercent,
      stock,
      slug,
      description,
      isNew: isNew === "true" || isNew === true,
      isPopular: isPopular === "true" || isPopular === true,
      isFlashSale: isFlashSale === "true" || isFlashSale === true,
      updatedAt: new Date(),
    };

    if (req.file) {
      const cleanPath = req.file.path
        .replace(/\\/g, "/")
        .replace(/^public\//, "");
      payload.thumbnail = cleanPath;
    }

    if (!req.file && req.body.thumbnail) {
      // Lấy ảnh cũ mà bị dính theo domain
      let thumb = req.body.thumbnail.trim();

      // Cắt domain rồi thay bằng uploads/
      thumb = thumb.replace(/^https?:\/\/[^\/]+\//, "");

      payload.thumbnail = `uploads/${thumb}`;
    }

    const product = await productService.updateById(id, payload);
    sendJsonSuccess(res, product, "Product updated successfully");
  } catch (error) {
    next(error);
  }
};

// Create a new product
const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thumbnailPath = req.file ? `uploads/${req.file.filename}` : null;

    // ✅ Gọi service
    const product = await productService.create({
      ...req.body,
      thumbnail: thumbnailPath,
    });

    sendJsonSuccess(res, product, "Product created successfully");
  } catch (error) {
    console.error("❌ Lỗi khi tạo sản phẩm:", error);
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
  findAllClient,
  findBySlugClient,
  findByCategorySlugClient,
  findByCategoryTagsClient,
};
