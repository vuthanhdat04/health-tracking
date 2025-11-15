import { saveMetric } from "../services/metric.service.js";
import { success, error } from "../utils/response.js";

export const createMetric = (req, res) => {
  const body = req.body;

  if (!body.userId || !body.type || !body.value) {
    return res.status(400).json(error("Missing metric data"));
  }

  const result = saveMetric(body);
  return res.json(success("Metric saved", result));
};
