import createError from "http-errors";
import Customer from "../models/Customer.model";

const findAll = async (query: any) => {
  const { keyword, sort_type = "desc", city, is_active } = query;

  const where: any = {};

  // 🔹 Lọc theo keyword (họ tên hoặc số điện thoại)
  if (keyword) {
    where.$or = [
      { phone: { $regex: keyword, $options: "i" } },
      { full_name: { $regex: keyword, $options: "i" } },
    ];
  }

  // 🔹 Lọc theo thành phố
  if (city) {
    where.city = { $regex: city, $options: "i" };
  }

  // 🔹 Lọc theo trạng thái hoạt động
  if (is_active !== undefined && is_active !== "") {
    // vì query param luôn là string => cần ép kiểu
    if (is_active === "true" || is_active === true) {
      where.is_active = true;
    } else if (is_active === "false" || is_active === false) {
      where.is_active = false;
    }
  }

  // 🔹 Truy vấn DB + populate đơn hàng
  const customers = await Customer.find(where)
    .populate({
      path: "orders",
      model: "Order",
      select: "total_amount",
    })
    .lean();

  // 🔹 Tính tổng chi tiêu
  const result = customers.map((c) => {
    const totalSpent = (c.orders || []).reduce(
      (sum, order: any) => sum + (order.total_amount || 0),
      0
    );
    return { ...c, totalSpent };
  });

  // 🔹 Sắp xếp theo tổng chi tiêu
  result.sort((a, b) =>
    sort_type === "asc" ? a.totalSpent - b.totalSpent : b.totalSpent - a.totalSpent
  );

  return result;
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
    email: payload.email,
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
