import { NextFunction, Request, Response } from "express";
import voucherService from "../services/voucher.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const vouchers = await voucherService.findAll();
    sendJsonSuccess(res, vouchers);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const voucher = await voucherService.findById(id);
    sendJsonSuccess(res, voucher);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const voucher = await voucherService.create(req.body);
    sendJsonSuccess(res, voucher, "Voucher created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const voucher = await voucherService.updateById(id, req.body);
    sendJsonSuccess(res, voucher, "Voucher updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const voucher = await voucherService.deleteById(id);
    sendJsonSuccess(res, voucher, "Voucher deleted successfully");
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
