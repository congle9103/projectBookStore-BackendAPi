import { Schema, model } from 'mongoose';
import { ICategory } from '../types/category.type';

const categorySchema = new Schema<ICategory>({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 50
  },
  description: {
    type: String,
    maxlength: 500
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true,
    minlength: 3,
    maxlength: 255
  }
}, {
  timestamps: true,
  versionKey: false
});

const Category = model('Category', categorySchema);
export default Category;
