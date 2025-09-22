import { Types } from "mongoose";

export interface ICrossSaleOption {
  name: string;
  price: number;
  description?: string;
  isActive?: boolean;
}

export interface IProduct {
  _id?: Types.ObjectId;
  product_name: string;
  category_id: Types.ObjectId;
  supplier: string;
  publisher: string;
  authors: string[];

  pages?: number;
  publicationYear?: number;
  language?: "Tiếng Việt" | "Tiếng Anh" | "Tiếng Nhật" | "Tiếng Hàn" | "Khác";
  format?: "Bìa mềm" | "Bìa cứng" | "Ebook" | "Khác";
  dimensions?: string;
  weight?: number;

  thumbnails?: string[];

  crossSaleOptions?: ICrossSaleOption[];

  originalPrice: number;
  discountPercent?: number;
  price?: number;
  voucher?: Types.ObjectId;

  stock: number;
  sold?: number;

  isNew?: boolean;
  isPopular?: boolean;
  isFlashSale?: boolean;
  tags?: string[];
  highlights?: string[];

  description?: string;

  slug: string;

  status?: "available" | "out_of_stock" | "discontinued";

  views?: number;
  ratingsAverage?: number;
  ratingsQuantity?: number;

  reviews?: Types.ObjectId[];

  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  createdAt?: Date;
  updatedAt?: Date;
}