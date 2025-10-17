import mongoose, { Schema, model } from "mongoose";
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
    pages: { required: true, type: Number, min: 50, max: 3000 },
    publicationYear: {
      type: Number,
      min: [1900, "Năm xuất bản quá cũ"],
      max: [new Date().getFullYear(), "Năm xuất bản không vượt hiện tại"],
    },
    format: {
      required: true,
      type: String,
      trim: true,
      enum: ["Bìa mềm", "Bìa cứng"],
    },
    dimensions: {
      required: true,
      type: String,
      trim: true,
      match: [/^[0-9]+x[0-9]+x[0-9]+(cm|mm)?$/, "Định dạng: rộngxcaoxdày"],
    },
    weight: { required: true, type: Number, min: 100, max: 5000 },

    // Media
    thumbnail: {
      type: String,
      required: [true, "Ảnh sản phẩm là bắt buộc"],
      validate: {
        validator: (url: string) => /^(http|https):\/\/[^ "]+$/.test(url),
        message: "Thumbnail phải là URL hợp lệ",
      },
    },

    // Giá & khuyến mãi
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 90 },
    price: { type: Number, min: 0 },
    voucher: { type: Schema.Types.ObjectId, ref: "Voucher" },

    // Quản lý tồn kho
    stock: { type: Number, required: true, min: 0, default: 0 },

    // Marketing
    isNew: { type: Boolean, default: false },
    isPopular: { type: Boolean, default: false },
    isFlashSale: { type: Boolean, default: false },

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

    // Thống kê
    ratingsAverage: { type: Number, min: 0, max: 5, default: 0 },
    ratingsQuantity: { type: Number, default: 0 },

    // 👉 Tham chiếu Review (mối quan hệ nhiều-nhiều)
    reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Middleware: tự động tính price nếu có discountPercent
productSchema.pre("save", function (this: IProduct, next) {
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
