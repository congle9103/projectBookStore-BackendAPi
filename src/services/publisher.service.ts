import createError from "http-errors";
import Publisher from "../models/Publisher.model";

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
  const publishers = await Publisher.find(where)
    .skip(skip)
    .limit(limit)
    .sort(sortObject);

  const totalRecords = await Publisher.countDocuments(where);

  return { publishers, page, limit, totalRecords };
};

const findById = async (id: string) => {
  const publisher = await Publisher.findById(id);
  if (!publisher) {
    throw createError(404, "Publisher not found");
  }
  return publisher;
};

const create = async (payload: any) => {
  const newPublisher = new Publisher({
    name: payload.name,
    description: payload.description,
    slug: payload.slug,
  });
  await newPublisher.save();
  return newPublisher;
};

const updateById = async (id: string, payload: any) => {
  const publisher = await findById(id);
  Object.assign(publisher, payload);
  await publisher.save();
  return publisher;
};

const deleteById = async (id: string) => {
  const publisher = await findById(id);
  await Publisher.findByIdAndDelete(publisher._id);
  return publisher;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};