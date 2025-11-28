// src/controllers/metric.controller.js
const metricService = require("../services/metric.service");
const { successResponse, errorResponse } = require("../utils/response");

// POST /api/metrics
const createMetric = async (req, res) => {
  try {
    const { userId, weight, height, heartRate, systolic, diastolic, date, note } = req.body;

    if (!userId || !weight || !height) {
      return errorResponse(res, "userId, weight, height là bắt buộc", 400);
    }

    const metric = await metricService.createMetric({
      userId,
      weight,
      height,
      heartRate,
      systolic,
      diastolic,
      date,
      note,
    });

    return successResponse(res, metric, "Tạo chỉ số sức khỏe thành công", 201);
  } catch (err) {
    console.error("createMetric error:", err);
    return errorResponse(res, "Không thể tạo chỉ số sức khỏe", 500);
  }
};

// GET /api/metrics?userId=...&limit=10
const getMetrics = async (req, res) => {
  try {
    const { userId, limit } = req.query;
    const metrics = await metricService.getMetrics({ userId, limit });
    return successResponse(res, metrics, "Lấy danh sách chỉ số sức khỏe thành công");
  } catch (err) {
    console.error("getMetrics error:", err);
    return errorResponse(res, "Không thể lấy danh sách chỉ số sức khỏe", 500);
  }
};

// GET /api/metrics/latest?userId=...
const getLatestMetric = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) return errorResponse(res, "Thiếu userId", 400);

    const latest = await metricService.getLatestMetric(userId);
    if (!latest) return errorResponse(res, "Chưa có dữ liệu chỉ số sức khỏe", 404);

    return successResponse(res, latest, "Lấy chỉ số sức khỏe mới nhất thành công");
  } catch (err) {
    console.error("getLatestMetric error:", err);
    return errorResponse(res, "Không thể lấy chỉ số sức khỏe mới nhất", 500);
  }
};

module.exports = {
  createMetric,
  getMetrics,
  getLatestMetric,
};
