// src/routes.js
const express = require("express");
const axios = require("axios");
const env = require("./config/env");
const { authMiddleware } = require("./auth");

const router = express.Router();

// Hàm tạo router proxy chung
function createProxyRouter(baseUrl) {
  const proxyRouter = express.Router();

  proxyRouter.use(async (req, res) => {
    try {
      const url = baseUrl + req.path; // baseUrl đã có /api/... rồi

      const response = await axios({
        method: req.method,
        url,
        params: req.query,
        data: req.body,
        headers: {
          // forward Authorization để service phía sau có thể dùng lại nếu muốn
          Authorization: req.headers["authorization"],
        },
      });

      return res.status(response.status).json(response.data);
    } catch (err) {
      if (err.response) {
        // lỗi từ service phía sau (4xx, 5xx)
        console.error("[api-gateway] proxy error status:", err.response.status);
        return res
          .status(err.response.status)
          .json(err.response.data || { success: false, message: "Downstream error" });
      }

      console.error("[api-gateway] proxy error:", err.message);
      return res.status(500).json({
        success: false,
        message: "Gateway error",
      });
    }
  });

  return proxyRouter;
}

// ----- Định tuyến -----

// user không cần auth (đăng ký, đăng nhập)
router.use("/users", createProxyRouter(env.userServiceUrl));

// các route còn lại yêu cầu token
router.use("/activities", authMiddleware, createProxyRouter(env.activityServiceUrl));

router.use("/metrics", authMiddleware, createProxyRouter(env.metricServiceUrl));

router.use("/progress", authMiddleware, createProxyRouter(env.progressServiceUrl));

module.exports = router;
