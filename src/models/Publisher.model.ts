import { Schema, model } from "mongoose";

const publisherSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên nhà xuất bản là bắt buộc"],
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

const Publisher = model("Publisher", publisherSchema);
export default Publisher;