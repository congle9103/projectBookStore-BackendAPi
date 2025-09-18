import createError from "http-errors";
import Product from "../models/Product.model";

const findAll = async () => {
  return await Product.find().populate("category");
};

const findById = async (id: string) => {
  const product = await Product.findById(id).populate("category");
  if (!product) {
    throw createError(404, "Product not found");
  }
  return product;
};

const create = async (payload: any) => {
  const newProduct = new Product({
    name: payload.name,
    description: payload.description,
    price: payload.price,
    stock: payload.stock,
    category: payload.category,
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
