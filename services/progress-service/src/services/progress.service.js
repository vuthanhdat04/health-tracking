// services/progress-service/src/services/progress.service.js
const DailySummary = require("../models/dailySummary.model");


// ====== HÀM XỬ LÝ EVENT TỪ RABBITMQ (HEALTH METRIC) ======
const handleIncomingMetricEvent = async (metric) => {
  try {
    // validate tối thiểu
    if (!metric?._id || !metric.userId) {
      console.warn("[progress-service] Invalid metric event:", metric);
      return;
    }


    const d = metric.date ? new Date(metric.date) : new Date();
    const dateStr = d.toISOString().slice(0, 10);


    // 🔍 lấy summary hiện tại
    const summary = await DailySummary.findOne({
      userId: metric.userId,
      date: dateStr,
    });


    // 🛑 nếu metric này đã xử lý rồi → bỏ
    if (summary?.processedMetricIds?.includes(metric._id)) {
      console.log(
        "[progress-service] Skip duplicated metric:",
        metric._id
      );
      return;
    }


    // ✅ chỉ update khi CHƯA xử lý
    await DailySummary.updateOne(
      { userId: metric.userId, date: dateStr },
      {
        $inc: { metricCount: 1 },
        $set: {
          lastBMI: metric.bmi ?? null,
          lastHeartRate: metric.heartRate ?? null,
        },
        $push: {
          processedMetricIds: metric._id,
        },
      },
      { upsert: true }
    );


    console.log(
      "[progress-service] Metric processed:",
      metric._id,
      "user:",
      metric.userId,
      "date:",
      dateStr
    );
  } catch (err) {
    console.error(
      "[progress-service] Failed to handle metric event:",
      err
    );
  }
};


// ====== API: LẤY PROGRESS THEO NGÀY ======
const getDailyProgress = async (userId, dateStr) => {
  return DailySummary.findOne({ userId, date: dateStr });
};


// ====== API: LẤY PROGRESS 7 NGÀY ======
const getWeeklyProgress = async (userId, endDateStr) => {
  const end = new Date(endDateStr + "T23:59:59.999Z");
  const start = new Date(end);
  start.setDate(end.getDate() - 6);
  start.setHours(0, 0, 0, 0);


  const startStr = start.toISOString().slice(0, 10);
  const endStr = end.toISOString().slice(0, 10);


  const dailyDocs = await DailySummary.find({
    userId,
    date: { $gte: startStr, $lte: endStr },
  }).sort({ date: 1 });


  const daily = dailyDocs.map((d) => ({
    date: d.date,
    metricCount: d.metricCount,
    bmi: d.lastBMI ?? null,
    heartRate: d.lastHeartRate ?? null,
  }));


  return {
    userId,
    start: startStr,   // ⚠️ client đang dùng
    end: endStr,       // ⚠️ client đang dùng
    totalMetrics: daily.reduce((s, d) => s + d.metricCount, 0),
    daily,
  };
};

module.exports = {
  handleIncomingMetricEvent,
  getDailyProgress,
  getWeeklyProgress,
};
