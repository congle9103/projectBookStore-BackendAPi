import { Types } from "mongoose";

export interface IFeedback {
  customer: Types.ObjectId;
  rating: number;
  comment?: string;
  createdAt?: Date;
}

export interface IEBook {
  // Thông tin cơ bản
  title: string;
  category_id: Types.ObjectId;
  authors: string[];
  publisher?: string;
  publicationYear?: number;
  language?: "Tiếng Việt" | "Tiếng Anh" | "Tiếng Nhật" | "Tiếng Hàn" | "Khác";

  // File ebook
  fileUrl: string;
  fileFormat: "pdf" | "epub" | "mobi";
  fileSize?: number;

  // Media
  thumbnails: string[];

  // Giá & khuyến mãi
  originalPrice: number;
  discountPercent?: number;
  price: number;
  voucher?: Types.ObjectId;

  // Marketing
  isNew: boolean;
  isPopular: boolean;
  isFlashSale: boolean;
  tags: string[];
  highlights: string[];

  // Feedback
  feedbacks: IFeedback[];
  ratingsAverage: number;
  ratingsQuantity: number;

  // Mô tả
  description?: string;

  // SEO
  slug: string;

  // Trạng thái
  status: "available" | "unavailable" | "discontinued";

  // Quản trị
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
}
