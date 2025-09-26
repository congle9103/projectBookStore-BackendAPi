import createError from "http-errors";
import Customer from "../models/Customer.model";

const findAll = async () => {
  return await Customer.find();
};

const findById = async (id: string) => {
  const customer = await Customer.findById(id);
  if (!customer) {
    throw createError(404, "Customer not found");
  }
  return customer;
};

const create = async (payload: any) => {
  const newCustomer = new Customer({
    username: payload.username,
    password: payload.password,
    full_name: payload.full_name,
    email: payload.email
  });

  await newCustomer.save();
  return newCustomer;
};

const updateById = async (id: string, payload: any) => {
  const updatedCustomer = await Customer.findByIdAndUpdate(
    id,
    { $set: payload },
    { new: true, runValidators: true }
  );
  return updatedCustomer;
};

const deleteById = async (id: string) => {
  const customer = await findById(id);
  await Customer.findByIdAndDelete(customer._id);
  return customer;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
