import createError from "http-errors";
import Category from "../models/Category.model";

const findAll = async (query: any) => {
  const {
    page = 1,
    limit = 5,
    keyword = null,
    sort_type = "desc",
    sort_by = "createdAt",
  } = query;

  // SORT
  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  // WHERE
  const where: any = {};
  if (keyword) where.product_name = { $regex: keyword, $options: "i" };

  const skip = (page - 1) * limit;
  const categories = await Category.find(where)
    .skip(skip)
    .limit(limit)
    .sort(sortObject)

  const totalRecords = await Category.countDocuments(where);

  return { categories, page, limit, totalRecords };
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
