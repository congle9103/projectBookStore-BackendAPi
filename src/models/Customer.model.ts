import { Schema, model } from "mongoose";
import {
  hashPassword,
  comparePassword,
} from "../middlewares/hashPassword.middleware";

const customerSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: 3,
      maxlength: 20,
      match: [
        /^(?![_.])(?!.*[_.]{2})[a-z0-9._]+(?<![_.])$/,
        "Username không được bắt đầu/kết thúc bằng '.' hoặc '_' và không có ký tự đặc biệt",
      ],
    },
    password: {
      type: String,
      minLength: 8,
      validate: {
        validator: function (v: string) {
          // Chỉ validate nếu đang tạo mới hoặc đang thay đổi mật khẩu
          if (this.isNew || this.isModified("password")) {
            return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
              v
            );
          }
          return true;
        },
        message:
          "Mật khẩu phải có ít nhất 8 ký tự, chứa chữ hoa, thường, số và ký tự đặc biệt",
      },
    },

    full_name: {
      type: String,
      trim: true,
      minLength: 3,
      maxLength: 100,
      default: "Khách hàng",
    },
    email: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: function (v: string) {
          return (
            !v ||
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
              v
            )
          );
        },
        message: "Email không hợp lệ",
      },
    },
    phone: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      match: [/^\d{10,15}$/, "Số điện thoại không hợp lệ"],
      default: "",
    },
    address: { type: String, trim: true, maxLength: 255, default: "" },
    city: { type: String, trim: true, maxLength: 100, default: "" },
    date_of_birth: { type: Date, default: null },
    gender: {
      type: String,
      enum: ["male", "female", "other"],
      default: "other",
    },
    point: { type: Number, default: 0, min: 0 },
    vouchers: [
      {
        code: { type: String, trim: true }, // Mã voucher
        type: { type: String, enum: ["percent", "fixed"] }, // Loại: % hoặc số tiền
        value: { type: Number, min: 0 }, // Mệnh giá
        quantity: { type: Number, default: 0, min: 0 }, // Số lượng khách hàng sở hữu
        expired_at: { type: Date }, // Ngày hết hạn
        is_active: { type: Boolean, default: true }, // Trạng thái
      },
    ],
    feedbacks: [{ type: Schema.Types.ObjectId, ref: "Review" }],

    orders: [{ type: Schema.Types.ObjectId, ref: "Order" }],

    is_active: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

// Gắn middleware hash password
customerSchema.pre("save", hashPassword);

// Gắn method comparePassword
customerSchema.methods.comparePassword = comparePassword;

const Customer = model("Customer", customerSchema);
export default Customer;
