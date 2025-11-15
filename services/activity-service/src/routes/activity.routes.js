import { Router } from "express";
import { createActivity } from "../controllers/activity.controller.js";

const router = Router();

router.post("/", createActivity);

export default router;
