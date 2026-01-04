// src/routes/progress.routes.js
const express = require("express");
const router = express.Router();
const {
  getWeeklyProgress,
} = require("../services/progress.service");


// GET /api/progress/weekly?userId=123&endDate=2025-11-28
router.get("/weekly", async (req, res) => {
  try {
    const { userId, endDate } = req.query;


    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId",
      });
    }


    const endDateStr = endDate
      ? new Date(endDate).toISOString().slice(0, 10)
      : new Date().toISOString().slice(0, 10);


    const data = await getWeeklyProgress(userId, endDateStr);


    return res.json({
      success: true,
      message: "Lấy báo cáo 7 ngày thành công",
      data,
    });
  } catch (err) {
    console.error("[progress-service] /weekly error", err);
    console.error("[progress-service] /weekly error details:", err.stack || err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo 7 ngày",
      error: err.message,
    });
  }
});


module.exports = router;


