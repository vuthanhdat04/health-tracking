import { Router } from "express";
import { createMetric } from "../controllers/metric.controller.js";

const router = Router();

router.post("/", createMetric);

export default router;
