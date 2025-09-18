import { Schema, model } from "mongoose";
import { ICombo } from "../types/combo.type";

const comboSchema = new Schema<ICombo>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: String, trim: true, maxlength: 2000 },
    products: [
      {
        product_id: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, default: 1, min: 1 },
      },
    ],
    originalPrice: { type: Number, required: true, min: 0 },
    discountPercent: { type: Number, min: 0, max: 90 },
    price: { type: Number, required: true, min: 0 },
    thumbnails: { type: [String], default: [] },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true, versionKey: false }
);

// Middleware: auto tính giá combo
comboSchema.pre("save", function (next) {
  if (this.originalPrice && this.discountPercent != null && !this.price) {
    this.price = Math.round(
      this.originalPrice * (1 - this.discountPercent / 100)
    );
  }

  if (this.originalPrice && !this.price && this.discountPercent == null) {
    this.price = this.originalPrice;
    this.discountPercent = 0;
  }

  next();
});

const Combo = model<ICombo>("Combo", comboSchema);
export default Combo;
