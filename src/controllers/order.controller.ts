import { NextFunction, Request, Response } from "express";
import orderService from "../services/order.service";
import { sendJsonSuccess } from "../helpers/response.helper";

// helper: trả về ISO string hoặc undefined
const toISOVnDayStart = (value?: any): string | undefined => {
  if (!value) return undefined;
  // nếu đã là ISO z hoặc có offset => new Date(value) ok
  // nếu chỉ "YYYY-MM-DD" => tạo chuỗi VN midnight
  const s = String(value);
  // detect YYYY-MM-DD (no T)
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    // tạo theo VN midnight rồi toISOString()
    return new Date(`${s}T00:00:00+07:00`).toISOString();
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return undefined;
  return d.toISOString();
};

const toISOVnDayEnd = (value?: any): string | undefined => {
  if (!value) return undefined;
  const s = String(value);
  if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
    return new Date(`${s}T23:59:59.999+07:00`).toISOString();
  }
  const d = new Date(s);
  if (isNaN(d.getTime())) return undefined;
  // if it's a date-only ISO we want end of that day in VN:
  return d.toISOString();
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, startDate, endDate, search } = req.query;

    // Chuẩn hoá
    const filters = {
      status: status ? String(status) : undefined,
      startDate: toISOVnDayStart(startDate),
      endDate: toISOVnDayEnd(endDate),
      search: search ? String(search) : undefined,
    };

    // debug: helpful logs during development
    console.log("Orders.findAll called with filters:", filters);

    const orders = await orderService.findAll(filters);
    sendJsonSuccess(res, orders);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderService.findById(id);
    sendJsonSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const order = await orderService.create(req.body);
    sendJsonSuccess(res, order, "Order created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderService.updateById(id, req.body);
    sendJsonSuccess(res, order, "Order updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const order = await orderService.deleteById(id);
    sendJsonSuccess(res, order, "Order deleted successfully");
  } catch (error) {
    next(error);
  }
};

export default {
  findAll,
  findById,
  create,
  updateById,
  deleteById,
};
