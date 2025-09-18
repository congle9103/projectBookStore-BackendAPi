import { NextFunction, Request, Response } from "express";
import comboService from "../services/combo.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const combos = await comboService.findAll();
    sendJsonSuccess(res, combos);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const combo = await comboService.findById(id);
    sendJsonSuccess(res, combo);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const combo = await comboService.create(req.body);
    sendJsonSuccess(res, combo, "Combo created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const combo = await comboService.updateById(id, req.body);
    sendJsonSuccess(res, combo, "Combo updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const combo = await comboService.deleteById(id);
    sendJsonSuccess(res, combo, "Combo deleted successfully");
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
