import createError from "http-errors";
import Product from "../models/Product.model";
import Category from "../models/Category.model";

/* ===========================
   🔹 PUBLIC SERVICE FUNCTIONS
   =========================== */

const findHomeProducts = async ({
  catId,
  limit = 5,
}: {
  catId: string;
  limit: number;
}) => {
  const products = await Product.find({ category_id: catId })
    .select("-createdAt -updatedAt -description")
    .limit(limit)
    .populate("category_id", "category_name slug")
  return products;
};

/* ===========================
   🔹 FIND ALL PRODUCTS (Admin page)
   =========================== */
const findAll = async (query: any) => {
  const {
    page = 1,
    limit = 5,
    keyword = null,
    sort_type = "desc",
    sort_by = "createdAt",
    cat_id = null,
    minPrice = null,
    maxPrice = null,
  } = query;

  // SORT
  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  // WHERE
  const where: any = {};
  if (keyword) where.product_name = { $regex: keyword, $options: "i" };
  if (cat_id) where.category_id = cat_id;
  if (minPrice || maxPrice) {
    where.price = {};
    if (minPrice) where.price.$gte = Number(minPrice);
    if (maxPrice) where.price.$lte = Number(maxPrice);
  }

  const skip = (page - 1) * limit;
  const products = await Product.find(where)
    .skip(skip)
    .limit(limit)
    .sort(sortObject)
    .populate("category_id", "category_name slug")

  const totalRecords = await Product.countDocuments(where);

  return { products, page, limit, totalRecords };
};

/* ===========================
   🔹 CRUD SERVICES
   =========================== */

const findById = async (id: string) => {
  const product = await Product.findById(id)
    .populate("category_id", "category_name")
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
    category_id: payload.category_id,
    thumbnails: payload.thumbnails,
    authors: payload.authors,
    publisher: payload.publisher,
    supplier: payload.supplier,
    publicationYear: payload.publicationYear,
    language: payload.language,
    weight: payload.weight,
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

    Object.assign(product, payload);
    await product.save();
    return product;
  } catch (err: any) {
    console.error("❌ Lỗi khi update sản phẩm:", err.message);
    console.error(err.errors || err);
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
  findHomeProducts,
};
