import { Schema, model } from "mongoose";
import { hashPassword, comparePassword } from "../middlewares/hashPassword";

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
      required: true,
      minLength: 8,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
      ],
    },

    full_name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
    avatar: { type: String, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Email không hợp lệ"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\d{10,15}$/, "Số điện thoại không hợp lệ"],
    },
    address: { type: String, trim: true, maxLength: 255 },
    city: { type: String, trim: true, maxLength: 100 },
    date_of_birth: { type: Date },
    gender: { type: String, enum: ["male", "female", "other"] },
    point: { type: Number, default: 0, min: 0 },
    vouchers: [
      {
        code: { type: String, required: true, trim: true }, // Mã voucher
        type: { type: String, enum: ["percent", "fixed"], required: true }, // Loại: % hoặc số tiền
        value: { type: Number, required: true, min: 0 }, // Mệnh giá
        quantity: { type: Number, default: 1, min: 0 }, // Số lượng khách hàng sở hữu
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
