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
    isNew: {
      type: Boolean,
      default: false,
    },
    isPopular: {
      type: Boolean,
      default: false,
    },
    isFlashSale: {
      type: Boolean,
      default: false,
    },
    slug: {
      type: String,
      required: [true, "Slug là bắt buộc"],
      lowercase: true,
      trim: true,
      unique: true,
      maxlength: [255, "Slug tối đa 255 ký tự"],
      match: [
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        "Slug chỉ chứa chữ thường, số và dấu gạch ngang",
      ],
    },
    thumbnails: {
      type: [String],
      validate: {
        validator: (arr: string[]) =>
          arr.every((url: string) => /^(http|https):\/\/[^ "]+$/.test(url)),
        message: "Thumbnail phải là URL hợp lệ",
      },
      default: [],
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
    pages: {
      type: Number,
      min: [1, "Số trang phải > 0"],
      max: [3000, "Số trang không vượt quá 3000 trang"],
    },
    price: {
      type: Number,
      required: true,
      min: [0, "Giá phải >= 0"],
    },
    originalPrice: {
      type: Number,
      min: [0, "Giá gốc phải >= 0"],
    },
    discountPercent: {
      type: Number,
      min: [0, "Giảm giá phải >= 0%"],
      max: [90, "Giảm giá không vượt quá 90%"],
    },
    publicationYear: {
      type: Number,
      min: [1900, "Năm xuất bản quá cũ"],
      max: [new Date().getFullYear(), "Năm xuất bản không vượt hiện tại"],
    },
    language: {
      type: String,
      trim: true,
      maxlength: [100, "Ngôn ngữ tối đa 100 ký tự"],
      enum: {
        values: ["Tiếng Việt", "Tiếng Anh", "Tiếng Nhật", "Tiếng Hàn", "Khác"],
        message: "{VALUE} không phải là ngôn ngữ hợp lệ",
      },
    },
    weight: {
      type: Number,
      min: [10, "Trọng lượng phải >= 10 gram"],
      max: [5000, "Trọng lượng không quá 5kg"],
    },
    dimensions: {
      type: String,
      trim: true,
      maxlength: [100, "Kích thước tối đa 100 ký tự"],
      match: [
        /^[0-9]+x[0-9]+x[0-9]+(cm|mm)?$/,
        "Kích thước phải theo định dạng: rộngxcaoxdày + đơn vị (cm/mm)",
      ],
    },
    format: {
      type: String,
      trim: true,
      maxlength: [100, "Hình thức tối đa 100 ký tự"],
      enum: {
        values: ["Bìa mềm", "Bìa cứng", "Ebook", "Khác"],
        message: "{VALUE} không phải là hình thức hợp lệ",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Middleware: tự động tính discountPercent hoặc price nếu bị thiếu
productSchema.pre("save", function (next) {
  if (this.originalPrice && this.price && !this.discountPercent) {
    this.discountPercent = Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }

  if (this.originalPrice && this.discountPercent && !this.price) {
    this.price = Math.round(
      this.originalPrice * (1 - this.discountPercent / 100)
    );
  }

  next();
});

const Product = model("Product", productSchema);
export default Product;
