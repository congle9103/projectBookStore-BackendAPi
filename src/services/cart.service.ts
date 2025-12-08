import createError from "http-errors";
import Cart from "../models/Cart.model";
import Product from "../models/Product.model";

const findByCustomer = async (customerUsername: string) => {
  const cart = await Cart.findOne({ customer: customerUsername }).populate({
    path: "items.product",
    select: "product_name price thumbnail category slug",
  });

  // Nếu chưa có thì trả rỗng, không lỗi
  return cart || { customer: customerUsername, items: [] };
};

const createCart = async (customerUsername: string, items: any[]) => {
  if (!Array.isArray(items)) throw createError(400, "Invalid cart data");

  // Validate productId tồn tại
  for (const item of items) {
    const exists = await Product.exists({ _id: item.product });
    if (!exists) throw createError(404, `Product ${item.product} not found`);
  }

  let cart = await Cart.findOne({ customer: customerUsername });
  if (cart) {
    cart.items = items;
    await cart.save();
  } else {
    cart = await Cart.create({ customer: customerUsername, items });
  }

  return cart;
};

const updateCart = async (customerUsername: string, items: any[]) => {
  if (!Array.isArray(items)) throw createError(400, "Invalid cart data");

  // Validate tất cả productId tồn tại
  for (const item of items) {
    const exists = await Product.exists({ _id: item.product });
    if (!exists) throw createError(404, `Product ${item.product} not found`);
  }

  let cart = await Cart.findOne({ customer: customerUsername });

  if (!cart) {
    // Nếu chưa có cart, tạo mới
    cart = await Cart.create({ customer: customerUsername, items });
  } else {
    // ✅ Nếu đã có cart, GHI ĐÈ LUÔN ITEMS
    cart.items = items;
    await cart.save();
  }

  return await cart.populate({
    path: "items.product",
    select: "product_name price thumbnail category slug",
  });
};



const clearCart = async (customerUsername: string) => {
  const cart = await Cart.findOneAndDelete({ customer: customerUsername });
  if (!cart) throw createError(404, "Cart not found");
  return cart;
};

export default {
  findByCustomer,
  createCart,
  updateCart,
  clearCart,
};
