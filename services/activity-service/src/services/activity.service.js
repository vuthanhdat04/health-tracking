// src/services/activity.service.js
const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema(
  {
    userId: { type: String, required: true }, // id user (có thể là ObjectId dạng string)
    type: { type: String, required: true },   // loại hoạt động: running, walking...
    duration: { type: Number, required: true }, // phút
    calories: { type: Number },
    distance: { type: Number }, // km
    date: { type: Date, default: Date.now },
    note: { type: String },
  },
  {
    timestamps: true,
  }
);

const Activity = mongoose.model("Activity", ActivitySchema);

// ----- Các hàm thao tác DB -----

const createActivity = async (payload) => {
  const activity = await Activity.create(payload);
  return activity;
};

const getActivities = async ({ userId, from, to }) => {
  const filter = {};

  if (userId) {
    filter.userId = userId;
  }

  if (from || to) {
    filter.date = {};
    if (from) filter.date.$gte = new Date(from);
    if (to) filter.date.$lte = new Date(to);
  }

  const activities = await Activity.find(filter).sort({ date: -1 });
  return activities;
};

const getActivityById = async (id) => {
  return Activity.findById(id);
};

const updateActivity = async (id, payload) => {
  const updated = await Activity.findByIdAndUpdate(id, payload, {
    new: true,
  });
  return updated;
};

const deleteActivity = async (id) => {
  const deleted = await Activity.findByIdAndDelete(id);
  return deleted;
};

module.exports = {
  createActivity,
  getActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
};
