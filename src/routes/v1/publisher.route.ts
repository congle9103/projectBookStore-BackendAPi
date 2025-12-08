import { Router } from "express";
import publisherController from "../../controllers/publisher.controller";
import { authorizeRole } from "../../middlewares/authorizeRole.middleware";
import { verifyToken } from "../../middlewares/verifyToken.middleware";

const router = Router();

router.get("/client", publisherController.findAllClient);

router.get("/",verifyToken, authorizeRole("admin", "product manager"), publisherController.findAll);

router.get("/:id", verifyToken, authorizeRole("admin", "product manager"), publisherController.findById);

router.post("/", verifyToken, authorizeRole("admin", "product manager"), publisherController.create);

router.put("/:id", verifyToken, authorizeRole("admin", "product manager"), publisherController.updateById);

router.delete("/:id", verifyToken, authorizeRole("admin", "product manager"), publisherController.deleteById);

export default router;