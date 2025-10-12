import * as supplierService from "../services/supplier.service";
import { Request, Response } from "express";

export const getAll = async (req: Request, res: Response) => {
  const suppliers = await supplierService.getAllSuppliers();
  res.json(suppliers);
};

export const getById = async (req: Request, res: Response) => {
  const supplier = await supplierService.getSupplierById(req.params.id);
  res.json(supplier);
};

export const create = async (req: Request, res: Response) => {
  const supplier = await supplierService.createSupplier(req.body);
  res.status(201).json(supplier);
};

export const update = async (req: Request, res: Response) => {
  const supplier = await supplierService.updateSupplier(req.params.id, req.body);
  res.json(supplier);
};

export const remove = async (req: Request, res: Response) => {
  await supplierService.deleteSupplier(req.params.id);
  res.status(204).end();
};