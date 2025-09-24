import createError from "http-errors";
import Product from "../models/Product.model";

const findAll = async () => {
  return await Product.find().populate("category_id");
};

const findById = async (id: string) => {
  const product = await Product.findById(id).populate("category_id");
  if (!product) {
    throw createError(404, "Product not found");
  }
  return product;
};

const create = async (payload: any) => {
  const newProduct = new Product({
    product_name: payload.product_name,
    category_id: payload.category_id,
    supplier: payload.supplier,
    publisher: payload.publisher,
    authors: payload.authors,
    originalPrice: payload.originalPrice,
    stock: payload.stock,
    slug: payload.slug,
  });

  await newProduct.save();
  return newProduct;
};


const updateById = async (id: string, payload: any) => {
  const product = await findById(id);
  Object.assign(product, payload);
  await product.save();
  return product;
};

const deleteById = async (id: string) => {
  const product = await findById(id);
  await Product.findByIdAndDelete(product._id);
  return product;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
