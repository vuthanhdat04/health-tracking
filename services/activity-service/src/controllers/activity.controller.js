import { saveActivity } from "../services/activity.service.js";
import { success, error } from "../utils/response.js";

export const createActivity = (req, res) => {
  const body = req.body;

  if (!body.userId || !body.type) {
    return res.status(400).json(error("Missing data"));
  }

  const result = saveActivity(body);
  return res.json(success("Activity recorded", result));
};
