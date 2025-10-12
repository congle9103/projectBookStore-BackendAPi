import { Schema, model } from "mongoose";

const supplierSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên nhà cung cấp là bắt buộc"],
      unique: true,
      trim: true,
      maxlength: 255,
    },
    description: {
      type: String,
      maxlength: 1000,
    },
  },
  { timestamps: true, versionKey: false }
);

const Supplier = model("Supplier", supplierSchema);
export default Supplier;