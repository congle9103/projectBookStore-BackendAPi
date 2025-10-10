import { Types } from "mongoose";

export interface ICategory {
  _id?: Types.ObjectId;
  category_name: string;
  description?: string;
  slug: string;
  createdAt?: Date;
  updatedAt?: Date;
}
