import createError from "http-errors";
import { Order, OrderItem  } from "../models/Order.model";

const findAll = async () => {
  return await Order.find()
    .populate({
      path: "items",
      populate: {
        path: "product", // vì trong OrderItem có ref tới Product
        model: "Product",
      },
    })
    .populate("customer, fullName")
    .populate("staff, fullName");
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
  // 1. Tạo các OrderItem từ payload.items
  const orderItems = await Promise.all(
    payload.items.map(async (i: any) => {
      const total = i.price * i.quantity;
      const newItem = new OrderItem({
        product: i.product,
        quantity: i.quantity,
        price: i.price,
        total,
      });
      return await newItem.save();
    })
  );

  const total_amount = orderItems.reduce((sum, item) => sum + item.total, 0);

  // 2. Tạo Order, items là danh sách _id của OrderItem
  const newOrder = new Order({
    customer: payload.customer,
    staff: payload.staff,
    items: orderItems.map((i) => i._id),
    payment_method: payload.payment_method,
    shipping_address: payload.shipping_address,
    city: payload.city,
    recipient_name: payload.recipient_name,
    recipient_phone: payload.recipient_phone,
    notes: payload.notes,
    status: payload.status,
    total_amount,
  });

  // 3. pre("save") trong Order sẽ tự tính total_amount
  await newOrder.save();
  return newOrder;
};


const updateById = async (id: string, payload: any) => {
  const order = await findById(id);

  // Nếu có items mới
  if (payload.items) {
    // Xóa các OrderItem cũ (tùy nhu cầu: nếu muốn giữ lại thì bỏ dòng này)
    await OrderItem.deleteMany({ _id: { $in: order.items } });

    // Tạo các OrderItem mới
    const orderItems = await Promise.all(
      payload.items.map(async (i: any) => {
        const total = i.price * i.quantity;
        const newItem = new OrderItem({
          product: i.product,
          quantity: i.quantity,
          price: i.price,
          total,
        });
        return await newItem.save();
      })
    );

    order.items = orderItems.map((i) => i._id);

    order.total_amount = orderItems.reduce((sum, item) => sum + item.total, 0);
  }

  // Các field còn lại
  if (payload.customer) order.customer = payload.customer;
  if (payload.staff) order.staff = payload.staff;
  if (payload.payment_method) order.payment_method = payload.payment_method;
  if (payload.shipping_address) order.shipping_address = payload.shipping_address;
  if (payload.city) order.city = payload.city;
  if (payload.recipient_name) order.recipient_name = payload.recipient_name;
  if (payload.recipient_phone) order.recipient_phone = payload.recipient_phone;
  if (payload.notes !== undefined) order.notes = payload.notes;
  if (payload.status) order.status = payload.status;

  // Nếu không đổi items nhưng vẫn muốn cập nhật total_amount (VD đổi quantity/price ở payload)
  if (!payload.items && payload.total_amount !== undefined) {
    order.total_amount = payload.total_amount;
  }

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
