import createError from "http-errors";
import Voucher from "../models/Voucher.model";

const findAll = async () => {
  return await Voucher.find()
    .populate("applicableProducts")
    .populate("applicableCategories");
};

const findById = async (id: string) => {
  const voucher = await Voucher.findById(id)
    .populate("applicableProducts")
    .populate("applicableCategories");
  if (!voucher) throw createError(404, "Voucher not found");
  return voucher;
};

const create = async (payload: any) => {
  const newVoucher = new Voucher(payload);
  await newVoucher.save();
  return newVoucher;
};

const updateById = async (id: string, payload: any) => {
  const voucher = await findById(id);
  Object.assign(voucher, payload);
  await voucher.save();
  return voucher;
};

const deleteById = async (id: string) => {
  const voucher = await findById(id);
  await Voucher.findByIdAndDelete(voucher._id);
  return voucher;
};

export default { findAll, findById, create, updateById, deleteById };
