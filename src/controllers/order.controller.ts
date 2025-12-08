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

// Create order by client
const createByClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const order = await orderService.createByClient(req.body);
    sendJsonSuccess(res, order, "Order created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// Find one order side client
const findAllByClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { customerId } = req.params;
    const order = await orderService.findAllByClient(customerId);
    sendJsonSuccess(res, order);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, startDate, endDate, search, payment_method } = req.query;

    const filters = {
      status: status ? String(status) : undefined,
      startDate: startDate ? toISOVnDayStart(String(startDate)) : undefined,
      endDate: endDate ? toISOVnDayEnd(String(endDate)) : undefined,
      search: search ? String(search) : undefined,
      payment_method: payment_method ? String(payment_method) : undefined, // thêm dòng này
    };

    // debug: helpful logs
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
  createByClient,
  findAllByClient,
};
