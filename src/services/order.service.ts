import createError from "http-errors";
import { Order } from "../models/Order.model";

const findAll = async () => {
  return await Order.find()
    .populate({
      path: "items",
      populate: {
        path: "product", // vì trong OrderItem có ref tới Product
        model: "Product",
      },
    })
    .populate("customer")
    .populate("staff");
};

const findById = async (id: string) => {
  const order = await Order.findById(id)
  .populate({
      path: "items",
      populate: {
        path: "product", // vì trong OrderItem có ref tới Product
        model: "Product",
      },
    })
    .populate("customer")
    .populate("staff");
  if (!order) {
    throw createError(404, "Order not found");
  }
  return order;
};

const create = async (payload: any) => {
  const newOrder = new Order({
    customer: payload.customer,                // required
    items: payload.items,                      // required
    payment_method: payload.payment_method,    // required
    total_amount: payload.total_amount,        // required (sẽ được tính lại trong pre-save)
    shipping_address: payload.shipping_address, // required
    city: payload.city,                        // required
    recipient_name: payload.recipient_name,    // required
    recipient_phone: payload.recipient_phone,  // required
    staff: payload.staff,                      // required
    notes: payload.notes,                      // optional
    status: payload.status                     // optional (default: "pending")
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
