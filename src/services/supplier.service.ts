import createError from "http-errors";
import Supplier from "../models/Supplier.model";

const findAllClient = async () => {
  const suppliers = await Supplier.find();
  return suppliers;
};

const findAll = async (query: any) => {
  const {
    page = 1,
    limit = 5,
    keyword = null,
    sort_type = "desc",
    sort_by = "updatedAt",
  } = query;

  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  const where: any = {};
  if (keyword) where.name = { $regex: keyword, $options: "i" };

  const skip = (page - 1) * limit;
  const suppliers = await Supplier.find(where)
    .skip(skip)
    .limit(limit)
    .sort(sortObject);

  const totalRecords = await Supplier.countDocuments(where);

  return { suppliers, page, limit, totalRecords };
};

const findById = async (id: string) => {
  const supplier = await Supplier.findById(id);
  if (!supplier) {
    throw createError(404, "Supplier not found");
  }
  return supplier;
};

const create = async (payload: any) => {
  const newSupplier = new Supplier({
    name: payload.name,
    description: payload.description,
    slug: payload.slug,
  });
  await newSupplier.save();
  return newSupplier;
};

const updateById = async (id: string, payload: any) => {
  const supplier = await findById(id);
  Object.assign(supplier, payload);
  await supplier.save();
  return supplier;
};

const deleteById = async (id: string) => {
  const supplier = await findById(id);
  await Supplier.findByIdAndDelete(supplier._id);
  return supplier;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
  findAllClient,
};