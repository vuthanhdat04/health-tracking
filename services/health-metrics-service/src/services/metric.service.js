// src/services/metric.service.js
const mongoose = require("mongoose");
const { publishMetricCreated } = require("../utils/rabbitmq"); // <-- thêm

const HealthMetricSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    weight: { type: Number, required: true }, // kg
    height: { type: Number, required: true }, // cm
    heartRate: { type: Number }, // bpm
    systolic: { type: Number }, // huyết áp trên
    diastolic: { type: Number }, // huyết áp dưới
    bmi: { type: Number }, // sẽ tính ở server
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  { timestamps: true }
);

const HealthMetric = mongoose.model("HealthMetric", HealthMetricSchema);

const calculateBMI = (weight, height) => {
  if (!weight || !height) return null;
  const hMeters = height / 100;
  return Number((weight / (hMeters * hMeters)).toFixed(2));
};

const createMetric = async (payload) => {
  const bmi = calculateBMI(payload.weight, payload.height);

  const metric = await HealthMetric.create({
    ...payload,
    bmi,
  });

  // --- publish event sang RabbitMQ để progress-service xử lý ---
  try {
    publishMetricCreated({
      id: metric._id.toString(),
      userId: metric.userId,
      weight: metric.weight,
      height: metric.height,
      bmi: metric.bmi,
      heartRate: metric.heartRate,
      systolic: metric.systolic,
      diastolic: metric.diastolic,
      date: metric.date,
      note: metric.note,
    });
  } catch (err) {
    console.error(
      "[health-metrics-service] Failed to publish metric event",
      err
    );
    // không throw lại để tránh làm hỏng API khi message broker gặp lỗi
  }

  return metric;
};

const getMetrics = async ({ userId, limit = 20 }) => {
  const filter = {};
  if (userId) filter.userId = userId;

  const metrics = await HealthMetric.find(filter)
    .sort({ date: -1 })
    .limit(Number(limit));

  return metrics;
};

const getLatestMetric = async (userId) => {
  if (!userId) return null;
  return HealthMetric.findOne({ userId }).sort({ date: -1 });
};

module.exports = {
  createMetric,
  getMetrics,
  getLatestMetric,
};
