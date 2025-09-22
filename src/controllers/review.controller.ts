import { NextFunction, Request, Response } from "express";
import reviewService from "../services/review.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.findAll();
    sendJsonSuccess(res, reviews);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const review = await reviewService.findById(id);
    sendJsonSuccess(res, review);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.create(req.body);
    sendJsonSuccess(res, review, "Review created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const review = await reviewService.updateById(id, req.body);
    sendJsonSuccess(res, review, "Review updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const review = await reviewService.deleteById(id);
    sendJsonSuccess(res, review, "Review deleted successfully");
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
