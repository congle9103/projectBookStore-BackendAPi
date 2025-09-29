import { Schema, model } from "mongoose";
import { IOrder, IOrderItem } from "../types/order.type";

// OrderItem schema
const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: [true, "Sản phẩm là bắt buộc"],
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, "Số lượng phải ít nhất là 1"],
      default: 1,
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Giá không hợp lệ"],
    },
    total: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền không hợp lệ"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const OrderItem = model("OrderItem", orderItemSchema);

// Order schema
const orderSchema = new Schema<IOrder>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Khách hàng là bắt buộc"],
    },
    staff: {
      type: Schema.Types.ObjectId,
      ref: "Staff", // nhân viên xử lý đơn
      required: true,
    },
    items: {
      type: [
        {
          type: Schema.Types.ObjectId,
          ref: "OrderItem",
          required: true,
        },
      ],
      validate: {
        validator: (arr: Schema.Types.ObjectId[]) => arr.length > 0,
        message: "Đơn hàng phải có ít nhất 1 sản phẩm",
      },
    },
    status: {
      type: String,
      enum: ["pending", "processing", "shipping", "completed", "cancelled"],
      default: "pending",
    },
    payment_method: {
      type: String,
      enum: [
        "cash_on_delivery",
        "zalopay",
        "vnpay",
        "shopeepay",
        "momo",
        "atm",
        "visa",
      ],
      required: [true, "Phương thức thanh toán là bắt buộc"],
    },
    total_amount: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền đơn hàng không hợp lệ"],
    },
    shipping_address: {
      type: String,
      required: true,
      trim: true,
      minlength: [10, "Địa chỉ giao hàng quá ngắn"],
      maxlength: [255, "Địa chỉ giao hàng quá dài"],
    },
    city: {
      type: String,
      required: true,
      trim: true,
      enum: {
        values: ["Hà Nội", "TP Hồ Chí Minh", "Đà Nẵng"],
      },
    },
    recipient_name: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Tên người nhận quá ngắn"],
      maxlength: [100, "Tên người nhận tối đa 100 ký tự"],
    },
    recipient_phone: {
      type: String,
      required: true,
      match: [/^\d{10,15}$/, "Số điện thoại người nhận không hợp lệ"],
    },
    notes: {
      type: String,
      maxlength: [500, "Ghi chú tối đa 500 ký tự"],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Order = model("Order", orderSchema);

export { Order, OrderItem };
