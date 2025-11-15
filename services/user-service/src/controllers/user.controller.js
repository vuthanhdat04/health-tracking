import { createUser, findUser } from "../services/user.service.js";
import { success, error } from "../utils/response.js";

export const registerUser = (req, res) => {
  const body = req.body;

  if (!body.email || !body.name)
    return res.status(400).json(error("Missing user info"));

  const result = createUser(body);
  return res.json(success("User created", result));
};

export const getUser = (req, res) => {
  const id = req.params.id;

  const result = findUser(id);
  if (!result) return res.status(404).json(error("User not found"));

  return res.json(success("User loaded", result));
};
