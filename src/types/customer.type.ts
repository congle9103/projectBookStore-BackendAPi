import { Types } from "mongoose";

export interface ICustomer {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone?: string;
  address?: string;
  date_of_birth?: Date;
  gender?: "male" | "female" | "other";
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // method instance
  comparePassword(candidatePassword: string): Promise<boolean>;
}
