import { Schema } from "mongoose";

export interface IVoucher {
  code: string;
  discountType: "percent" | "fixed";
  discountValue: number;
  minOrderValue?: number;
  maxDiscount?: number;
  startDate: Date;
  endDate: Date;
  usageLimit: number;
  usedCount: number;
  applicableProducts?: Schema.Types.ObjectId[];
  applicableCategories?: Schema.Types.ObjectId[];
  isActive: boolean;
}