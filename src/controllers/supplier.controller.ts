import { NextFunction, Request, Response } from "express";
import supplierService from "../services/supplier.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const suppliers = await supplierService.findAll(req.query);
    sendJsonSuccess(res, suppliers);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.findById(id);
    sendJsonSuccess(res, supplier);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const supplier = await supplierService.create(req.body);
    sendJsonSuccess(res, supplier, "Supplier created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.updateById(id, req.body);
    sendJsonSuccess(res, supplier, "Supplier updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const supplier = await supplierService.deleteById(id);
    sendJsonSuccess(res, supplier, "Supplier deleted successfully");
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