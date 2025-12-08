import { NextFunction, Request, Response } from "express";
import categoryService from "../services/category.service";
import { sendJsonSuccess } from "../helpers/response.helper";

const findAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.findAll(req.query);
    sendJsonSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

const findAllbyClient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const categories = await categoryService.findAllbyClient();
    sendJsonSuccess(res, categories);
  } catch (error) {
    next(error);
  }
};

const findById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryService.findById(id);
    sendJsonSuccess(res, category);
  } catch (error) {
    next(error);
  }
};

const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const thumbnailPath = req.file ? `uploads/${req.file.filename}` : null;

    const category = await categoryService.create({ ...req.body, thumbnail: thumbnailPath });
    sendJsonSuccess(res, category, "Category created successfully", 201);
  } catch (error) {
    next(error);
  }
};

const updateById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;

    // Build payload từ req.body (text fields)
    const { name, slug, description } = req.body;
    const payload: any = {};
    if (name !== undefined) payload.name = name;
    if (slug !== undefined) payload.slug = slug;
    if (description !== undefined) payload.description = description;

    // Nếu multer đã đính file => req.file có giá trị (ảnh mới)
    if (req.file) {
      // Chuẩn hóa đường dẫn và loại bỏ "public/"
  const cleanPath = req.file.path.replace(/\\/g, "/").replace(/^public\//, "");
  payload.thumbnail = cleanPath;
    } else if (req.body.thumbnail) {
      // Nếu frontend gửi lại URL/chuỗi thumbnail (không đổi file)
      // (thường là fileList[0].url từ AntD)
      payload.thumbnail = req.body.thumbnail;
    }

    const category = await categoryService.updateById(id, payload);
    sendJsonSuccess(res, category, "Category updated successfully");
  } catch (error) {
    next(error);
  }
};

const deleteById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const category = await categoryService.deleteById(id);
    sendJsonSuccess(res, category, "Category deleted successfully");
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
  findAllbyClient
};
