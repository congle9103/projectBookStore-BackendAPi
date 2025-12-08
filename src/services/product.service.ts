import createError from "http-errors";
import Product from "../models/Product.model";
import { populate } from "dotenv";
import Category from "../models/Category.model";

// Find all products for client
const findAllClient = async (query: any) => {
  const { keyword = null, sort_type = "desc", sort_by = "updatedAt" } = query;

  // SORT
  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  // WHERE
  const where: any = {};
  if (keyword) {
    where.product_name = { $regex: keyword, $options: "i" };
  }

  const products = await Product.find(where)
    .sort(sortObject)
    .populate("category", "name slug")
    .populate("publisher", "name slug")
    .populate("supplier", "name slug");

  return products;
};

// Find products by category for client
const findByCategorySlugClient = async (slug, query) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  console.log("Slug nhận được:", slug);

  const category = await Category.findOne({ slug: slug.trim() });
  console.log("Category tìm thấy:", category);

  if (!category) throw createError(404, "Category not found");

  const products = await Product.find({ category: category._id })
    .populate("category supplier publisher")
    .skip(skip)
    .limit(Number(limit));

  const totalRecords = await Product.countDocuments({ category: category._id });

  return { products, page: Number(page), limit: Number(limit), totalRecords };
};

// Find product by category slug (for client)
const findBySlugClient = async (slug: string) => {
  const product = await Product.findOne({ slug }).populate(
    "category supplier publisher"
  );

  if (!product) throw createError(404, "Product not found");

  return product;
};

// Find by categoryProductTags client
const findByCategoryTagsClient = async (tag: string, query: any) => {
  const { page = 1, limit = 10 } = query;
  const skip = (page - 1) * limit;

  const validTags = ["isNew", "isPopular", "isFlashSale"];

  // Kiểm tra tag hợp lệ
  if (!validTags.includes(tag)) {
    throw createError(400, "Tag không hợp lệ");
  }

  // Filter động theo tag
  const filter: any = { [tag]: true };

  // Lấy danh sách sản phẩm với skip & limit
  const products = await Product.find(filter)
    .populate("category supplier publisher")
    .skip(skip)
    .limit(Number(limit));

  // Tổng số sản phẩm (không skip/limit)
  const totalRecords = await Product.countDocuments(filter);

  if (!products.length) {
    throw createError(404, "Không tìm thấy sản phẩm");
  }

  return {
    products,
    page: Number(page),
    limit: Number(limit),
    totalRecords,
  };
};

/* ===========================
   🔹 FIND ALL PRODUCTS (Admin page)
   =========================== */
const findAll = async (query: any) => {
  const {
    page = 1,
    limit = 5,
    keyword = null,        // tìm theo tên sách HOẶC tác giả
    sort_type = "desc",    // asc / desc
    sort_by = "createdAt", // chỉ dùng createdAt hoặc price
    min_price = null,
    max_price = null,
    cat_id = null,         // thể loại
    supplier_id = null,    // nhà cung cấp
    publisher_id = null,   // nhà xuất bản
  } = query;

  // ==================== SORT ====================
  let sortObject: Record<string, 1 | -1> = {};
  if (sort_by === "price") {
    sortObject.price = sort_type === "desc" ? -1 : 1;
  } else {
    sortObject.createdAt = sort_type === "desc" ? -1 : 1;
  }

  // ==================== WHERE ====================
  const where: any = {};

  // Tìm theo tên sách HOẶC tác giả
  if (keyword) {
    const searchRegex = { $regex: keyword.trim(), $options: "i" };
    where.$or = [
      { product_name: searchRegex },
      { authors: searchRegex },
    ];
  }

  // Lọc theo giá hiện tại
  if (min_price || max_price) {
    where.price = {};
    if (min_price) where.price.$gte = Number(min_price);
    if (max_price) where.price.$lte = Number(max_price);
  }

  // Lọc theo thể loại
  if (cat_id) {
    where.category = cat_id;
  }

  // Lọc theo nhà cung cấp
  if (supplier_id) {
    where.supplier = supplier_id;
  }

  // Lọc theo nhà xuất bản
  if (publisher_id) {
    where.publisher = publisher_id;
  }

  const skip = (page - 1) * limit;

  const products = await Product.find(where)
    .skip(skip)
    .limit(limit)
    .sort(sortObject)
    .populate("category", "name slug")
    .populate("supplier", "name")
    .populate("publisher", "name");

  const totalRecords = await Product.countDocuments(where);

  return {
    products,
    page: Number(page),
    limit: Number(limit),
    totalRecords,
  };
};

/* ===========================
   🔹 CRUD SERVICES
   =========================== */

const findById = async (id: string) => {
  const product = await Product.findById(id);
  if (!product) throw createError(404, "Product not found");
  return product;
};

const create = async (payload: any) => {
  const newProduct = new Product({
    product_name: payload.product_name,
    slug: payload.slug,
    description: payload.description,
    price: payload.price,
    originalPrice: payload.originalPrice,
    discountPercent: payload.discountPercent,
    stock: payload.stock,
    model_year: payload.model_year,
    category: payload.category,
    thumbnail: payload.thumbnail,
    authors: payload.authors,
    publisher: payload.publisher,
    supplier: payload.supplier,
    publicationYear: payload.publicationYear,
    weight: payload.weight,
    dimensions: payload.dimensions,
    format: payload.format,
    pages: payload.pages,
    isNew: payload.isNew,
    isPopular: payload.isPopular,
    isFlashSale: payload.isFlashSale,
  });

  await newProduct.save();
  return newProduct;
};

const updateById = async (id: string, payload: any) => {
  try {
    const product = await findById(id);
    if (!product) throw new Error("Product not found");

    // Gán field hợp lệ
    Object.keys(payload).forEach((key) => {
      if (key === "_id") return; // bỏ qua _id
      product[key] = payload[key];
    });

    await product.save();
    return product;
  } catch (err: any) {
    console.error("❌ Lỗi khi update sản phẩm:", err.message);
    throw err;
  }
};

const deleteById = async (id: string) => {
  const product = await findById(id);
  await Product.findByIdAndDelete(product._id);
  return product;
};

/* ===========================
   🔹 EXPORT SERVICE
   =========================== */
export default {
  findAll,
  findById,
  create,
  deleteById,
  updateById,
  findAllClient,
  findBySlugClient,
  findByCategorySlugClient,
  findByCategoryTagsClient,
};
