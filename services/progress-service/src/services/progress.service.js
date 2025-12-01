// services/progress-service/src/services/progress.service.js
const mongoose = require("mongoose");
const DailySummary = require("../models/dailySummary.model");

// ====== MODELS DỮ LIỆU GỐC (ACTIVITY + HEALTH METRIC) ======
const ActivitySchema = new mongoose.Schema(
  {
    userId: String,
    type: String,
    duration: Number,
    calories: Number,
    distance: Number,
    date: Date,
  },
  { collection: "activities" } // trỏ đúng tên collection của activity-service
);

const HealthMetricSchema = new mongoose.Schema(
  {
    userId: String,
    weight: Number,
    height: Number,
    heartRate: Number,
    systolic: Number,
    diastolic: Number,
    bmi: Number,
    date: Date,
  },
  { collection: "healthmetrics" } // collection của health-metrics-service
);

const Activity = mongoose.model("ActivityProgress", ActivitySchema);
const HealthMetric = mongoose.model("HealthMetricProgress", HealthMetricSchema);

// ====== HÀM HỖ TRỢ THỜI GIAN ======
const startOfDay = (d) => {
  const date = new Date(d);
  date.setHours(0, 0, 0, 0);
  return date;
};

const endOfDay = (d) => {
  const date = new Date(d);
  date.setHours(23, 59, 59, 999);
  return date;
};

// ====== PROGRESS TRONG 1 NGÀY (dùng cho API /daily) ======
const getDailyProgress = async (userId, date = new Date()) => {
  const from = startOfDay(date);
  const to = endOfDay(date);

  const activities = await Activity.find({
    userId,
    date: { $gte: from, $lte: to },
  });

  const latestMetric = await HealthMetric.findOne({
    userId,
    date: { $lte: to },
  }).sort({ date: -1 });

  const totalDuration = activities.reduce(
    (sum, a) => sum + (a.duration || 0),
    0
  );
  const totalCalories = activities.reduce(
    (sum, a) => sum + (a.calories || 0),
    0
  );
  const totalDistance = activities.reduce(
    (sum, a) => sum + (a.distance || 0),
    0
  );

  return {
    date: from,
    totalActivities: activities.length,
    totalDuration,
    totalCalories,
    totalDistance,
    latestMetric,
  };
};

// ====== EVENT-DRIVEN: XỬ LÝ MESSAGE TỪ RABBITMQ (vẫn giữ để demo) ======
const handleIncomingMetricEvent = async (metric) => {
  const d = metric.date ? new Date(metric.date) : new Date();
  const dateStr = d.toISOString().slice(0, 10); // YYYY-MM-DD

  await DailySummary.findOneAndUpdate(
    { userId: metric.userId, date: dateStr },
    { $inc: { metricCount: 1 } },
    { upsert: true, new: true }
  );

  console.log(
    "[progress-service] Updated daily summary from metric event for user:",
    metric.userId,
    "date:",
    dateStr
  );
};

// ====== BÁO CÁO 7 NGÀY (dùng trực tiếp activities + metrics) ======
const getWeeklyProgress = async (userId, endDate = new Date()) => {
  const end = endOfDay(endDate);
  const start = new Date(end);
  start.setDate(end.getDate() - 6); // 7 ngày gần nhất
  start.setHours(0, 0, 0, 0);

  const activities = await Activity.find({
    userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1 });

  const metrics = await HealthMetric.find({
    userId,
    date: { $gte: start, $lte: end },
  }).sort({ date: 1 });

  // Gom hoạt động theo từng ngày
  const dailyMap = {};
  for (const a of activities) {
    const key = startOfDay(a.date).toISOString().slice(0, 10);
    if (!dailyMap[key]) {
      dailyMap[key] = {
        totalDuration: 0,
        totalCalories: 0,
        totalDistance: 0,
        count: 0,
      };
    }
    dailyMap[key].totalDuration += a.duration || 0;
    dailyMap[key].totalCalories += a.calories || 0;
    dailyMap[key].totalDistance += a.distance || 0;
    dailyMap[key].count += 1;
  }

  const daily = Object.keys(dailyMap)
    .sort()
    .map((dateKey) => ({
      date: dateKey,
      ...dailyMap[dateKey],
    }));

  return {
    start,
    end,
    totalActivities: activities.length,
    daily,
    metrics, // danh sách chỉ số sức khỏe trong tuần (nếu muốn show thêm sau này)
  };
};

module.exports = {
  getDailyProgress,
  getWeeklyProgress,
  handleIncomingMetricEvent,
};
