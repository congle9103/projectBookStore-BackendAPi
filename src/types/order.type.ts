import { Types } from "mongoose";

export interface IOrderItem {
  _id?: Types.ObjectId;
  product: Types.ObjectId;
  quantity: number;
  price: number;
  total: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IOrder {
  _id?: Types.ObjectId;
  customer: Types.ObjectId;
  staff?: Types.ObjectId;
  items: Types.ObjectId[];
  status: "pending" | "processing" | "shipping" | "completed" | "cancelled";
  payment_method:
    | "cash_on_delivery"
    | "zalopay"
    | "vnpay"
    | "shopeepay"
    | "momo"
    | "atm"
    | "visa";
  total_amount: number;
  shipping_address: string;
  recipient_name: string;
  recipient_phone: string;
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}