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
      min: [10000, "Giá không hợp lệ"],
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
        "Ví ZaloPay",
        "VNPAY",
        "Ví ShopeePay",
        "Ví Momo",
        "ATM",
        "Visa",
        "Thanh toán bằng tiền mặt khi nhận hàng",
      ],

      required: [true, "Phương thức thanh toán là bắt buộc"],
    },
    total_amount: {
      type: Number,
      required: true,
      min: [0, "Tổng tiền đơn hàng không hợp lệ"],
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
