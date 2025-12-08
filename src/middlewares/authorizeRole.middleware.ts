import createError from "http-errors";

export const authorizeRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) return next(createError(401, "Chưa xác thực"));

    if (!allowedRoles.includes(req.user.role)) {
      return next(createError(403, "Bạn không có quyền truy cập"));
    }

    next();
  };
};
