// src/routes/metric.routes.js
const express = require("express");
const metricController = require("../controllers/metric.controller");

const router = express.Router();

router.post("/", metricController.createMetric);
router.get("/", metricController.getMetrics);
router.get("/latest", metricController.getLatestMetric);

module.exports = router;
