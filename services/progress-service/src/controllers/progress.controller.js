// src/controllers/progress.controller.js
const progressService = require("../services/progress.service");
const { successResponse, errorResponse } = require("../utils/response");

// GET /api/progress/daily?userId=123&date=2025-11-28
const getDailyProgress = async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId) return errorResponse(res, "Thiếu userId", 400);

    const result = await progressService.getDailyProgress(
      userId,
      date ? new Date(date) : new Date()
    );

    return successResponse(res, result, "Lấy tiến độ theo ngày thành công");
  } catch (err) {
    console.error("getDailyProgress error:", err);
    return errorResponse(res, "Không thể lấy tiến độ theo ngày", 500);
  }
};

// GET /api/progress/weekly?userId=123&endDate=2025-11-28
const getWeeklyProgress = async (req, res) => {
  try {
    const { userId, endDate } = req.query;
    if (!userId) return errorResponse(res, "Thiếu userId", 400);

    const result = await progressService.getWeeklyProgress(
      userId,
      endDate ? new Date(endDate) : new Date()
    );

    return successResponse(res, result, "Lấy tiến độ theo tuần thành công");
  } catch (err) {
    console.error("getWeeklyProgress error:", err);
    return errorResponse(res, "Không thể lấy tiến độ theo tuần", 500);
  }
};

module.exports = {
  getDailyProgress,
  getWeeklyProgress,
};
