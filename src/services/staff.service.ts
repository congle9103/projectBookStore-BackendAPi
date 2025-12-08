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
    sort_by = "createdAt",
    role,
    is_active,
  } = query;

  const where: any = {};

  if (keyword) {
    where.$or = [
      { username: { $regex: keyword, $options: "i" } },
      { full_name: { $regex: keyword, $options: "i" } },
      { email: { $regex: keyword, $options: "i" } },
      { phone: { $regex: keyword, $options: "i" } },
    ];
  }

  if (minSalary || maxSalary) {
    where.salary = {};
    if (minSalary) where.salary.$gte = Number(minSalary);
    if (maxSalary) where.salary.$lte = Number(maxSalary);
  }

  if (role) {
    where.role = role;
  }

  // lọc theo ngày tuyển dụng
  if (query.hire_date_from || query.hire_date_to) {
    where.hire_date = {};
    if (query.hire_date_from) where.hire_date.$gte = new Date(query.hire_date_from);
    if (query.hire_date_to) where.hire_date.$lte = new Date(query.hire_date_to);
  }

  if (is_active === "true") where.is_active = true;
  if (is_active === "false") where.is_active = false;

  const sortObject: Record<string, 1 | -1> = {
    [sort_by]: sort_type === "desc" ? -1 : 1,
  };

  const skip = (Number(page) - 1) * Number(limit);

  const staffs = await Staff.find(where)
    .sort(sortObject)
    .skip(skip)
    .limit(Number(limit))
    .lean();

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
    email: payload.email,
    salary: payload.salary,
    phone: payload.phone,
    role: payload.role,
    hire_date: payload.hire_date,
    is_active: payload.is_active,
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
