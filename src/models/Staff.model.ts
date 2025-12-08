import { Schema, model } from "mongoose";
import { hashPassword, comparePassword } from "../middlewares/hashPassword.middleware";
import { IStaff } from "../types/staff.type";

const staffSchema = new Schema<IStaff>( 
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
      validate: {
    validator: function (value: string) {
      // ✅ Chỉ validate nếu là mật khẩu mới (không phải hash)
      if (!this.isModified("password")) return true;
      return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(
        value
      );
    },
    message:
      "Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường, 1 số và 1 ký tự đặc biệt",
  },
    },
    full_name: {
      type: String,
      required: true,
      trim: true,
      minLength: 3,
      maxLength: 100,
    },
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
      required: true,
      unique: true,
      trim: true,
      match: [/^\d{10,15}$/, "Số điện thoại không hợp lệ"],
    },
    role: {
      type: String,
      enum: ["admin", "product manager", "order staff", "marketing", "CSKH", "System staff"],
      default: "dev",
    },
    salary: {
      type: Number,
      required: true,
      min: 0,
    },
    hire_date: {
      type: Date,
      required: true,
      default: Date.now, // Ngày tuyển dụng mặc định là ngày tạo
    },
    is_active: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

// Gắn middleware hash password
staffSchema.pre("save", hashPassword);

// Gắn method comparePassword
staffSchema.methods.comparePassword = comparePassword;

const Staff = model("Staff", staffSchema);
export default Staff;
