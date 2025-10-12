import * as publisherService from "../services/publisher.service";
import { Request, Response } from "express";

export const getAll = async (req: Request, res: Response) => {
  const publishers = await publisherService.getAllPublishers();
  res.json(publishers);
};

export const getById = async (req: Request, res: Response) => {
  const publisher = await publisherService.getPublisherById(req.params.id);
  res.json(publisher);
};

export const create = async (req: Request, res: Response) => {
  const publisher = await publisherService.createPublisher(req.body);
  res.status(201).json(publisher);
};

export const update = async (req: Request, res: Response) => {
  const publisher = await publisherService.updatePublisher(req.params.id, req.body);
  res.json(publisher);
};

export const remove = async (req: Request, res: Response) => {
  await publisherService.deletePublisher(req.params.id);
  res.status(204).end();
};