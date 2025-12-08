import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import Staff from "../models/Staff.model";
import Customer from "../models/Customer.model";

const SECRET_KEY = process.env.SECRET_KEY || "your_secret_key"; // nhớ đặt trong .env

// 🧑‍💼 STAFF LOGIN
export const loginStaff = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const staff = await Staff.findOne({ username });
    if (!staff)
      return res.status(404).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch)
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const token = jwt.sign(
      { id: staff._id, role: staff.role },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      data: {
        token,
        user: {
          username: staff.username,
          role: staff.role,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

// 👤 CUSTOMER LOGIN
export const loginCustomer = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    const customer = await Customer.findOne({ username });
    if (!customer)
      return res.status(404).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const isMatch = await bcrypt.compare(password, customer.password);
    if (!isMatch)
      return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

    const token = jwt.sign(
      { id: customer._id, role: "customer" },
      SECRET_KEY,
      { expiresIn: "2h" }
    );

    res.json({
      message: "Đăng nhập thành công",
      data: {
        token,
        user: {
          id: customer._id,
          username: customer.username,
          full_name: customer.full_name,
          email: customer.email,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};
