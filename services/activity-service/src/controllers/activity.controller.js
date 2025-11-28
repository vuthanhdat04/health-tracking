// src/controllers/activity.controller.js
const activityService = require("../services/activity.service");
const { successResponse, errorResponse } = require("../utils/response");

// POST /api/activities
const createActivity = async (req, res) => {
  try {
    const { userId, type, duration, calories, distance, date, note } = req.body;

    if (!userId || !type || !duration) {
      return errorResponse(res, "userId, type và duration là bắt buộc", 400);
    }

    const newActivity = await activityService.createActivity({
      userId,
      type,
      duration,
      calories,
      distance,
      date,
      note,
    });

    return successResponse(res, newActivity, "Tạo hoạt động thành công", 201);
  } catch (err) {
    console.error("createActivity error:", err);
    return errorResponse(res, "Không thể tạo hoạt động", 500);
  }
};

// GET /api/activities?userId=...&from=...&to=...
const getActivities = async (req, res) => {
  try {
    const { userId, from, to } = req.query;

    const activities = await activityService.getActivities({ userId, from, to });

    return successResponse(res, activities, "Lấy danh sách hoạt động thành công");
  } catch (err) {
    console.error("getActivities error:", err);
    return errorResponse(res, "Không thể lấy danh sách hoạt động", 500);
  }
};

// GET /api/activities/:id
const getActivityById = async (req, res) => {
  try {
    const { id } = req.params;

    const activity = await activityService.getActivityById(id);
    if (!activity) {
      return errorResponse(res, "Không tìm thấy hoạt động", 404);
    }

    return successResponse(res, activity, "Lấy chi tiết hoạt động thành công");
  } catch (err) {
    console.error("getActivityById error:", err);
    return errorResponse(res, "Không thể lấy chi tiết hoạt động", 500);
  }
};

// PUT /api/activities/:id
const updateActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await activityService.updateActivity(id, req.body);
    if (!updated) {
      return errorResponse(res, "Không tìm thấy hoạt động để cập nhật", 404);
    }

    return successResponse(res, updated, "Cập nhật hoạt động thành công");
  } catch (err) {
    console.error("updateActivity error:", err);
    return errorResponse(res, "Không thể cập nhật hoạt động", 500);
  }
};

// DELETE /api/activities/:id
const deleteActivity = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await activityService.deleteActivity(id);
    if (!deleted) {
      return errorResponse(res, "Không tìm thấy hoạt động để xoá", 404);
    }

    return successResponse(res, null, "Xoá hoạt động thành công");
  } catch (err) {
    console.error("deleteActivity error:", err);
    return errorResponse(res, "Không thể xoá hoạt động", 500);
  }
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
