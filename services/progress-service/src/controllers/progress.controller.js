// src/controllers/progress.controller.js
const progressService = require("../services/progress.service");
const { successResponse, errorResponse } = require("../utils/response");

// helper: convert Date -> YYYY-MM-DD
const toDateString = (d) => {
  return new Date(d).toISOString().slice(0, 10);
};

// GET /api/progress/daily?userId=123&date=2025-11-28
const getDailyProgress = async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId) {
      return errorResponse(res, "Thiếu userId", 400);
    }

    const dateStr = date ? toDateString(date) : toDateString(new Date());

    const result = await progressService.getDailyProgress(userId, dateStr);

    return successResponse(
      res,
      result,
      "Lấy tiến độ theo ngày thành công"
    );
  } catch (err) {
    console.error("getDailyProgress error:", err);
    return errorResponse(res, "Không thể lấy tiến độ theo ngày", 500);
  }
};

// GET /api/progress/weekly?userId=123&endDate=2025-11-28
const getWeeklyProgress = async (req, res) => {
  try {
    const { userId, endDate } = req.query;
    if (!userId) {
      return errorResponse(res, "Thiếu userId", 400);
    }

    const endDateStr = endDate
      ? toDateString(endDate)
      : toDateString(new Date());

    const result = await progressService.getWeeklyProgress(
      userId,
      endDateStr
    );

    return successResponse(
      res,
      result,
      "Lấy tiến độ theo tuần thành công"
    );
  } catch (err) {
    console.error("getWeeklyProgress error:", err);
    return errorResponse(res, "Không thể lấy tiến độ theo tuần", 500);
  }
};

module.exports = {
  getDailyProgress,
  getWeeklyProgress,
};
