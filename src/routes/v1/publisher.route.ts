import { Router } from "express";
import * as publisherController from "../../controllers/publisher.controller";

const router = Router();

router.get("/", publisherController.getAll);
router.get("/:id", publisherController.getById);
router.post("/", publisherController.create);
router.put("/:id", publisherController.update);
router.delete("/:id", publisherController.remove);

export default router;