import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  product_name: string;
  category: Types.ObjectId;
  supplier: Types.ObjectId;
  publisher: Types.ObjectId;
  authors: string;

  pages?: number;
  publicationYear?: number;
  format?: "Bìa mềm" | "Bìa cứng";
  dimensions?: string;
  weight?: number;

  thumbnail?: string;

  originalPrice: number;
  discountPercent?: number;
  price?: number;
  voucher?: Types.ObjectId;

  stock: number;
  sold?: number;

  isNew?: boolean;
  isPopular?: boolean;
  isFlashSale?: boolean;

  description?: string;

  slug: string;

  status?: "available" | "out_of_stock" | "discontinued";

  ratingsAverage?: number;
  ratingsQuantity?: number;

  reviews?: Types.ObjectId[];

  createdAt?: Date;
  updatedAt?: Date;
}