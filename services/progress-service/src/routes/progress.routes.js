// src/routes/progress.routes.js
const express = require("express");
const progressController = require("../controllers/progress.controller");

const router = express.Router();

router.get("/daily", progressController.getDailyProgress);
router.get("/weekly", progressController.getWeeklyProgress);

module.exports = router;
