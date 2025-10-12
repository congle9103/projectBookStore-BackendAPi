import { Router } from "express";
import publisherController from "../../controllers/publisher.controller";

const router = Router();

router.get("/", publisherController.findAll);
router.get("/:id", publisherController.findById);
router.post("/", publisherController.create);
router.put("/:id", publisherController.updateById);
router.delete("/:id", publisherController.deleteById);

export default router;