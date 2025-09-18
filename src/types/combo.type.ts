import { Schema } from "mongoose";

export interface ICombo {
  name: string;
  description?: string;
  products: {
    product_id: Schema.Types.ObjectId;
    quantity: number;
  }[];
  originalPrice: number;
  discountPercent?: number;
  price: number;
  thumbnails?: string[];
  isActive: boolean;
}