import express from "express";
import { register, login } from "../controllers/auth.controller.js";
import { forgotPassword, resetPassword } from "../controllers/password.controller.js";

const router = express.Router();

//login & register
router.post("/register", register);
router.post("/login", login);

//forgot password
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);

export default router;
