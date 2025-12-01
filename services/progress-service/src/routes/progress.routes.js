// src/routes/progress.routes.js
const express = require("express");
const router = express.Router();
const {
  getDailyProgress,
  getWeeklyProgress,
} = require("../services/progress.service");

// Lấy tiến độ trong 1 ngày
router.get("/daily", async (req, res) => {
  try {
    const { userId, date } = req.query;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId",
      });
    }

    const progress = await getDailyProgress(
      userId,
      date ? new Date(date) : new Date()
    );

    return res.json({
      success: true,
      message: "Lấy tiến độ ngày thành công",
      data: progress,
    });
  } catch (err) {
    console.error("[progress-service] /daily error", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy tiến độ ngày",
      error: err.message,
    });
  }
});

// Báo cáo 7 ngày gần nhất
router.get("/weekly", async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "Thiếu userId",
      });
    }

    const data = await getWeeklyProgress(userId);

    return res.json({
      success: true,
      message: "Lấy báo cáo 7 ngày thành công",
      data,
    });
  } catch (err) {
    console.error("[progress-service] /weekly error", err);
    return res.status(500).json({
      success: false,
      message: "Lỗi khi lấy báo cáo 7 ngày",
      error: err.message,
    });
  }
});

module.exports = router;
