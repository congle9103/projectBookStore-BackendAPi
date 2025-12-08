import { NextFunction, Request, Response } from "express";
import customerService from "../services/customer.service";
import { sendJsonSuccess } from "../helpers/response.helper";

// Get customers by client
const findOnebyClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customers = await customerService.findOnebyClient(
      req.params.username
    );
    sendJsonSuccess(res, customers);
  } catch (error) {
    next(error);
  }
};

// Create customer side client
const createByClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const customer = await customerService.createByClient(req.body);
    sendJsonSuccess(res, customer, "Customer created successfully", 201);
  } catch (error) {
    next(error);
  }
};

// Put customer side client
const updateByClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const customer = await customerService.updateByClient(username, req.body);
    sendJsonSuccess(res, customer, "Customer updated successfully");
  } catch (error) {
    next(error);
  }
};

// Put customer add-order side client
const addOrderByClient = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { username } = req.params;
    const { orderId } = req.body;
    const customer = await customerService.addOrderByClient(username, orderId);
    sendJsonSuccess(res, customer, "Order added to customer successfully");
  } catch (error) {
    next(error);
  }
};

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customers = await customerService.findAll(req.query);
    sendJsonSuccess(res, customers);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customerService.findById(id);
    sendJsonSuccess(res, customer);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const customer = await customerService.create(req.body);
    sendJsonSuccess(res, customer, "Customer created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customerService.updateById(id, req.body);
    sendJsonSuccess(res, customer, "Customer updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const customer = await customerService.deleteById(id);
    sendJsonSuccess(res, customer, "Customer deleted successfully");
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
  updateByClient,
  findOnebyClient,
  addOrderByClient,
};
