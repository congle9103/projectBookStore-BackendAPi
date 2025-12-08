import jwt from "jsonwebtoken";
import createError from "http-errors";
import { NextFunction, Request, Response } from "express";

const SECRET_KEY = process.env.SECRET_KEY

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers["authorization"];

  // 🔥 Nếu không có header
  if (!authHeader) {
    return next(createError(401, "Không có token trong header"));
  }

  // ✅ Đảm bảo header dạng "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return next(createError(401, "Định dạng token không hợp lệ"));
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, SECRET_KEY);
    req.user = decoded; // ✅ { id, role }
    next();
  } catch (err) {
    console.error("Error verifying token:", err);
    return next(createError(403, "Token không hợp lệ hoặc hết hạn"));
  }
};
