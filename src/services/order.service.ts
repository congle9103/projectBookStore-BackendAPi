import createError from "http-errors";
import { Order, OrderItem } from "../models/Order.model";
import Customer from "../models/Customer.model";
import Staff from "../models/Staff.model";

// Create order by client
const createByClient = async (payload: any) => {
  // 1. Tạo và lưu OrderItem riêng lẻ
  const orderItems = await Promise.all(
    payload.items.map(async (i: any) => {
      const total = i.price * i.quantity;
      const newItem = new OrderItem({
        product: i.product,
        quantity: i.quantity,
        price: i.price,
        total,
      });
      return await newItem.save(); // lưu trực tiếp vào collection OrderItem
    })
  );

  // 2. Tính tổng tiền
  const total_amount = orderItems.reduce((sum, item) => sum + item.total, 0);

  // 3. Tạo Order với danh sách ObjectId của OrderItem
  const newOrder = new Order({
    customer: payload.customer,
    items: orderItems.map((i) => i._id), // chỉ lấy _id, không populate
    payment_method: payload.payment_method,
    shipping_address: payload.shipping_address,
    city: payload.city,
    notes: payload.notes,
    status: payload.status,
    total_amount,
  });

  // 4. Lưu Order
  await newOrder.save();

  return newOrder;
};

// Find one order side client
const findAllByClient = async (customerId: string) => {
  const order = await Order.find({ customer: customerId })
    .populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
        select: "product_name thumbnail",
      },
    })
    .populate("customer", "full_name phone price address city");

  if (!order) {
    throw createError(404, "Order not found for this customer");
  }

  return order;
};

const findAll = async (filters: {
  status?: string;
  startDate?: string;
  endDate?: string;
  search?: string;
  payment_method?: string;
}) => {
  const query: any = {};

  // Lọc theo phương thức thanh toán
  if (filters.payment_method && filters.payment_method.trim() !== "") {
    query.payment_method = filters.payment_method;
  }

  // Lọc theo status
  if (filters.status && filters.status.trim() !== "") {
    query.status = filters.status.toLowerCase();
  }

  // Lọc theo khoảng thời gian tạo đơn (createdAt)
  if (filters.startDate || filters.endDate) {
    query.createdAt = {};
    if (filters.startDate) {
      const gte = new Date(filters.startDate);
      if (!isNaN(gte.getTime())) query.createdAt.$gte = gte;
    }
    if (filters.endDate) {
      const lte = new Date(filters.endDate);
      if (!isNaN(lte.getTime())) query.createdAt.$lte = lte;
    }
  }

  // Lọc theo search (full_name hoặc phone của customer)
  if (filters.search && filters.search.trim() !== "") {
    const regex = new RegExp(filters.search.trim(), "i");

    const customers = await Customer.find({ full_name: regex }).select("_id");
    const customersByPhone = await Customer.find({ phone: regex }).select(
      "_id"
    );

    query.$or = [
      { customer: { $in: customers.map((c: any) => c._id) } },
      { customer: { $in: customersByPhone.map((c: any) => c._id) } },
    ];
  }

  return await Order.find(query)
    .populate({
      path: "items",
      populate: {
        path: "product",
        model: "Product",
        select: "product_name",
      },
    })
    .populate("customer", "full_name phone price address city")
    .sort({ createdAt: -1 });
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
    items: orderItems.map((i) => i._id),
    payment_method: payload.payment_method,
    shipping_address: payload.shipping_address,
    city: payload.city,
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
  if (payload.payment_method) order.payment_method = payload.payment_method;
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
  createByClient,
  findAllByClient,
};
