import createError from "http-errors";
import Staff from "../models/Staff.model";

const findAll = async (query: any) => {
  const {
    page = 1,
    limit = 5,
    keyword = "",
    minSalary = null,
    maxSalary = null,
    sort_type = "desc",
    sort_by = "updatedAt",
  } = query;

  // =========================
  // 📌 WHERE (lọc & tìm kiếm)
  // =========================
  const where: any = {};

  if (keyword) {
    where.$or = [
      { full_name: { $regex: keyword, $options: "i" } },
      { username: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ];
  }
  if (minSalary || maxSalary) {
    where.salary = {};
    if (minSalary) where.salary.$gte = Number(minSalary);
    if (maxSalary) where.salary.$lte = Number(maxSalary);
  }

  // =========================
  // 📌 SORT 
  // =========================
  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  // =========================
  // 📌 PAGINATION
  // =========================
  const skip = (Number(page) - 1) * Number(limit);

  // =========================
  // 📌 QUERY
  // =========================
  const staffs = await Staff.find(where)
    .sort(sortObject)
    .skip(skip)
    .limit(Number(limit));

  const totalRecords = await Staff.countDocuments(where);

  return {
    data: staffs,
    page: Number(page),
    limit: Number(limit),
    totalRecords,
  };
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
