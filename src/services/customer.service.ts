import createError from "http-errors";
import Customer from "../models/Customer.model";

 const findAll = async (query: any) => {
  try {
    const {
      page = 1,
      limit = 5,
      keyword = "",
      sort_type = "desc", // sắp xếp theo tổng tiền
    } = query;

    const skip = (page - 1) * limit;

    // ----- Tìm theo keyword -----
    const where: any = {};
    if (keyword) {
      where.$or = [
        { username: { $regex: keyword, $options: "i" } },
        { phone: { $regex: keyword, $options: "i" } },
      ];
    }

    // ----- Lấy khách hàng và populate đơn hàng -----
    const customers = await Customer.find(where)
      .populate({
        path: "orders",
        select: "total_amount", // chỉ lấy các trường cần
      })
      .skip(skip)
      .limit(Number(limit));

    // ----- Tính tổng tiền từng khách hàng -----
    const result = customers
      .map((customer) => {
        const totalSpent = customer.orders?.reduce(
          (sum, order) => sum + (order.total_amount || 0),
          0
        );

        return {
          _id: customer._id,
          username: customer.username,
          full_name: customer.full_name,
          email: customer.email,
          totalSpent,
          orders: customer.orders,
        };
      })
      // chỉ giữ người có đơn hàng
      .filter((c) => c.totalSpent > 0)
      // sắp xếp
      .sort((a, b) =>
        sort_type === "asc"
          ? a.totalSpent - b.totalSpent
          : b.totalSpent - a.totalSpent
      );

    const totalRecords = await Customer.countDocuments(where);

    return {
      customers: result,
      page: Number(page),
      limit: Number(limit),
      totalRecords,
    };
  } catch (error) {
    console.error("findAll customers error:", error);
    throw error;
  }
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
