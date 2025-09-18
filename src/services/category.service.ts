import createError from "http-errors";
import Category from "../models/Category.model";

const findAll = async () => {
  return await Category.find();
};

const findById = async (id: string) => {
  const category = await Category.findById(id);
  if (!category) {
    throw createError(404, "Category not found");
  }
  return category;
};

const create = async (payload: any) => {
  const newCategory = new Category({
    name: payload.name,
    description: payload.description,
    slug: payload.slug,
  });
  await newCategory.save();
  return newCategory;
};

const updateById = async (id: string, payload: any) => {
  const category = await findById(id);
  Object.assign(category, payload);
  await category.save();
  return category;
};

const deleteById = async (id: string) => {
  const category = await findById(id);
  await Category.findByIdAndDelete(category._id);
  return category;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
