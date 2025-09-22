import { Schema, model } from "mongoose";

const reviewSchema = new Schema(
  {
    customer: { type: Schema.Types.ObjectId, ref: "Customer", required: true }, // Người đánh giá
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },        // Sách được đánh giá
    rating: { type: Number, required: true, min: 1, max: 5 },                  // Số sao (1-5)
    comment: { type: String, trim: true, maxlength: 1000 },                    // Nội dung
    is_active: { type: Boolean, default: true },                               // Trạng thái (ẩn/hiện)
  },
  { timestamps: true, versionKey: false }
);

const Review = model("Review", reviewSchema);
export default Review;
