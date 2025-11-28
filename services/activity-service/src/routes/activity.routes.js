// src/routes/activity.routes.js
const express = require("express");
const activityController = require("../controllers/activity.controller");

const router = express.Router();

// POST /api/activities
router.post("/", activityController.createActivity);

// GET /api/activities
router.get("/", activityController.getActivities);

// GET /api/activities/:id
router.get("/:id", activityController.getActivityById);

// PUT /api/activities/:id
router.put("/:id", activityController.updateActivity);

// DELETE /api/activities/:id
router.delete("/:id", activityController.deleteActivity);

module.exports = router;
