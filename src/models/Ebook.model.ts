import { Schema, model } from "mongoose";
import { IEBook } from "../types/ebook.type";

const eBookSchema = new Schema<IEBook>(
  {
    // Thông tin cơ bản
    title: {
      type: String,
      required: [true, "Tên ebook là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [2, "Tên ebook quá ngắn"],
      maxlength: [255, "Tên ebook tối đa 255 ký tự"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    authors: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Phải có ít nhất một tác giả",
      },
    },
    publisher: {
      type: String,
      trim: true,
      maxlength: 255,
    },
    publicationYear: {
      type: Number,
      min: [1900, "Năm xuất bản quá cũ"],
      max: [new Date().getFullYear(), "Năm xuất bản không vượt hiện tại"],
    },
    language: {
      type: String,
      trim: true,
      maxlength: 100,
      enum: ["Tiếng Việt", "Tiếng Anh", "Tiếng Nhật", "Tiếng Hàn", "Khác"],
    },

    // File ebook
    fileUrl: {
      type: String,
      required: [true, "Ebook phải có file"],
      trim: true,
      match: [/^(http|https):\/\/[^ "]+$/, "File URL phải hợp lệ"],
    },
    fileFormat: {
      type: String,
      enum: ["pdf", "epub", "mobi"],
      required: true,
    },
    fileSize: { type: Number, min: 1 }, // KB hoặc MB

    // Media
    thumbnails: {
      type: [String],
      default: [],
      validate: {
        validator: (arr: string[]) =>
          arr.every((url) => /^(http|https):\/\/[^ "]+$/.test(url)),
        message: "Thumbnail phải là URL hợp lệ",
      },
    },

    // Giá & khuyến mãi
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 90 },
    price: { type: Number, min: 0 },
    voucher: { type: Schema.Types.ObjectId, ref: "Voucher" },

    // Marketing
    isNew: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    highlights: { type: [String], default: [] },

    // Feedback (rating + review)
    feedbacks: [
      {
        customer: {
          type: Schema.Types.ObjectId,
          ref: "Customer",
          required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, trim: true, maxlength: 1000 },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    // Thống kê rating
    ratingsAverage: { type: Number, min: 1, max: 5, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },

    // Mô tả
    description: { type: String, maxlength: 5000 },

    // SEO
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
      match: [/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug chỉ chứa chữ thường, số, gạch ngang"],
    },

    // Trạng thái
    status: {
      type: String,
      enum: ["available", "unavailable", "discontinued"],
      default: "available",
    },

    // Quản trị
    createdBy: { type: Schema.Types.ObjectId, ref: "Staff" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Staff" },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware: tự động tính price nếu có discountPercent
eBookSchema.pre("save", function (this: IEBook, next) {
  if (this.originalPrice && this.discountPercent != null) {
    this.price = Math.round(this.originalPrice * (1 - this.discountPercent / 100));
  }
  if (this.originalPrice && this.discountPercent == null) {
    this.price = this.originalPrice;
    this.discountPercent = 0;
  }
  next();
});

const EBook = model("EBook", eBookSchema);
export default EBook;
