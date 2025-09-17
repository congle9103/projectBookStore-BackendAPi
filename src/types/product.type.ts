import { Types } from "mongoose";

export interface IProduct {
  _id?: Types.ObjectId;
  product_name: string;
  category_id: Types.ObjectId;
  isNew?: boolean;
  isPopular?: boolean;
  isFlashSale?: boolean;
  slug: string;
  thumbnails?: string[];
  supplier: string;
  publisher: string;
  authors: string[];
  pages?: number;
  price: number;
  originalPrice?: number;
  discountPercent?: number;
  publicationYear?: number;
  language?: "Tiếng Việt" | "Tiếng Anh" | "Tiếng Nhật" | "Tiếng Hàn" | "Khác";
  weight?: number;
  dimensions?: string; // ví dụ: "20x30x5cm"
  format?: "Bìa mềm" | "Bìa cứng" | "Ebook" | "Khác";
  createdAt?: Date;
  updatedAt?: Date;
}
