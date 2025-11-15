import { calculateProgress } from "../services/progress.service.js";
import { success } from "../utils/response.js";

export const getUserProgress = (req, res) => {
  const userId = req.params.userId;

  const result = calculateProgress(userId);

  res.json(success("User progress", result));
};
