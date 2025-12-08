import { NextFunction, Request, Response } from "express";
import publisherService from "../services/publisher.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const findAllClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publishers = await publisherService.findAllClient();
    sendJsonSuccess(res, publishers);
  } catch (error) {
    next(error);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publishers = await publisherService.findAll(req.query);
    sendJsonSuccess(res, publishers);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const publisher = await publisherService.findById(id);
    sendJsonSuccess(res, publisher);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const publisher = await publisherService.create(req.body);
    sendJsonSuccess(res, publisher, "Publisher created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const publisher = await publisherService.updateById(id, req.body);
    sendJsonSuccess(res, publisher, "Publisher updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const publisher = await publisherService.deleteById(id);
    sendJsonSuccess(res, publisher, "Publisher deleted successfully");
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
  findAllClient,
};