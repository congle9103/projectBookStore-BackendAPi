import createError from "http-errors";
import {Order} from "../models/Order.model";

const findAll = async () => {
  return await Order.find().populate("customer").populate("products");
};

const findById = async (id: string) => {
  const order = await Order.findById(id).populate("customer").populate("products");
  if (!order) {
    throw createError(404, "Order not found");
  }
  return order;
};

const create = async (payload: any) => {
  const newOrder = new Order({
    customer: payload.customer,
    products: payload.products,
    total_price: payload.total_price,
    status: payload.status,
  });
  await newOrder.save();
  return newOrder;
};

const updateById = async (id: string, payload: any) => {
  const order = await findById(id);
  Object.assign(order, payload);
  await order.save();
  return order;
};

const deleteById = async (id: string) => {
  const order = await findById(id);
  await Order.findByIdAndDelete(order._id);
  return order;
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
