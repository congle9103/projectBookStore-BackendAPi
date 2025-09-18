import { Schema, model } from "mongoose";
import { IProduct } from "../types/product.type";

const productSchema = new Schema<IProduct>(
  {
    product_name: {
      type: String,
      required: [true, "Tên sản phẩm là bắt buộc"],
      unique: true,
      trim: true,
      minlength: [2, "Tên sản phẩm quá ngắn"],
      maxlength: [255, "Tên sản phẩm tối đa 255 ký tự"],
    },
    category_id: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    supplier: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Tên nhà cung cấp quá ngắn"],
      maxlength: [255, "Tên nhà cung cấp tối đa 255 ký tự"],
    },
    publisher: {
      type: String,
      required: true,
      trim: true,
      minlength: [2, "Tên nhà xuất bản quá ngắn"],
      maxlength: [255, "Tên nhà xuất bản tối đa 255 ký tự"],
    },
    authors: {
      type: [String],
      required: true,
      validate: {
        validator: (arr: string[]) => arr.length > 0,
        message: "Phải có ít nhất một tác giả",
      },
    },

    // Thông tin sách
    pages: { type: Number, min: 1, max: 3000 },
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
    format: {
      type: String,
      trim: true,
      enum: ["Bìa mềm", "Bìa cứng", "Ebook", "Khác"],
    },
    dimensions: {
      type: String,
      trim: true,
      match: [/^[0-9]+x[0-9]+x[0-9]+(cm|mm)?$/, "Định dạng: rộngxcaoxdày"],
    },
    weight: { type: Number, min: 10, max: 5000 },

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

    // 👉 Cross sale: dịch vụ đi kèm
    crossSaleOptions: [
      {
        name: { type: String, required: true, trim: true },
        price: { type: Number, required: true, min: 0 },
        description: { type: String, trim: true, maxlength: 500 },
        isActive: { type: Boolean, default: true },
      },
    ],

    // Giá & khuyến mãi
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 90 },
    price: { type: Number, min: 0 },
    voucher: { type: Schema.Types.ObjectId, ref: "Voucher" },

    // Quản lý tồn kho
    stock: { type: Number, required: true, min: 0, default: 0 },
    sold: { type: Number, min: 0, default: 0 },

    // Marketing
    isNew: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },
    tags: { type: [String], default: [] },
    highlights: { type: [String], default: [] },

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
      enum: ["available", "out_of_stock", "discontinued"],
      default: "available",
    },

    // Thống kê
    views: { type: Number, default: 0 },
    ratingsAverage: { type: Number, min: 1, max: 5, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },

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
productSchema.pre("save", function (this: IProduct ,next) {
  if (this.originalPrice && this.discountPercent != null) {
    this.price = Math.round(
      this.originalPrice * (1 - this.discountPercent / 100)
    );
  }
  if (this.originalPrice && this.discountPercent == null) {
    this.price = this.originalPrice;
    this.discountPercent = 0;
  }
  next();
});

const Product = model("Product", productSchema);
export default Product;
