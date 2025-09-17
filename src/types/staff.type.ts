import { Types } from "mongoose";

export interface IStaff {
  _id?: Types.ObjectId;
  username: string;
  password: string;
  full_name: string;
  email: string;
  phone?: string;
  role: "admin" | "dev";
  salary?: number;
  hire_date?: Date;
  is_active?: boolean;
  createdAt?: Date;
  updatedAt?: Date;

  // instance method
  comparePassword(candidatePassword: string): Promise<boolean>;
}
