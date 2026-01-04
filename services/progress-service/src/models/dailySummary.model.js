const mongoose = require("mongoose");

const dailySummarySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    date: { type: String, required: true }, // YYYY-MM-DD

    // aggregation
    metricCount: { type: Number, default: 0 },

    // snapshot cuối ngày
    lastBMI: { type: Number, default: null },
    lastHeartRate: { type: Number, default: null },
    processedMetricIds: {
      type: [String],
      default: [],
      index: true,
    },
  },
  { timestamps: true }
);

dailySummarySchema.index({ userId: 1, date: 1 }, { unique: true });

module.exports = mongoose.model("DailySummary", dailySummarySchema);
