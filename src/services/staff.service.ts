import createError from "http-errors";
import Staff from "../models/Staff.model";

const findAll = async () => {
  return await Staff.find();
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
