import createError from "http-errors";
import Staff from "../models/Staff.model";

const findAll = async (query: any) => {
  const {
    page = 1,
    limit = 5,
    keyword = null,
    sort_type = "desc",
    sort_by = "updatedAt",
  } = query;

  // SORT
  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  // WHERE
  const where: any = {};
  if (keyword) {
    where.$or = [
      { username: { $regex: keyword, $options: "i" } },
      { fullname: { $regex: keyword, $options: "i" } },
    ];
  }

  const skip = (page - 1) * limit;
  const staff = await Staff.find(where)
    .skip(skip)
    .limit(limit)
    .sort(sortObject);

  const totalRecords = await Staff.countDocuments(where);

  return { staff, page, limit, totalRecords };
};

const findById = async (id: string) => {
  const staff = await Staff.findById(id);
  if (!staff) {
    throw createError(404, "Staff not found");
  }
  return staff;
};

const create = async (payload: any) => {
  const newStaff = new Staff({
    username: payload.username,
    password: payload.password,
    full_name: payload.full_name,
    email: payload.email
  });

  await newStaff.save();
  return newStaff;
};

const updateById = async (id: string, payload: any) => {
  const staff = await findById(id);
  Object.assign(staff, payload);
  await staff.save();
  return staff;
};

const deleteById = async (id: string) => {
  const staff = await findById(id);
  await Staff.findByIdAndDelete(staff._id);
  return staff;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
