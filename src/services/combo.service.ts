import createError from "http-errors";
import Combo from "../models/Combo.model";

const findAll = async () => {
  return await Combo.find().populate("products.product_id");
};

const findById = async (id: string) => {
  const combo = await Combo.findById(id).populate("products.product_id");
  if (!combo) throw createError(404, "Combo not found");
  return combo;
};

const create = async (payload: any) => {
  const newCombo = new Combo(payload);
  await newCombo.save();
  return newCombo;
};

const updateById = async (id: string, payload: any) => {
  const combo = await findById(id);
  Object.assign(combo, payload);
  await combo.save();
  return combo;
};

const deleteById = async (id: string) => {
  const combo = await findById(id);
  await Combo.findByIdAndDelete(combo._id);
  return combo;
};

export default { findAll, findById, create, updateById, deleteById };
