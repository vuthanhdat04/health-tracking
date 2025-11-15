import { Router } from "express";
import { getUserProgress } from "../controllers/progress.controller.js";

const router = Router();

router.get("/:userId", getUserProgress);

export default router;
