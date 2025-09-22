import { Router } from "express";
import reviewController from "../../controllers/review.controller";

const router = Router();

// GET /api/v1/reviews
router.get("/", reviewController.findAll);

// GET /api/v1/reviews/:id
router.get("/:id", reviewController.findById);

// POST /api/v1/reviews
router.post("/", reviewController.create);

// PUT /api/v1/reviews/:id
router.put("/:id", reviewController.updateById);

// DELETE /api/v1/reviews/:id
router.delete("/:id", reviewController.deleteById);

export default router;
