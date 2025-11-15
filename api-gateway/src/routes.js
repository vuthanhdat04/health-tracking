import { createProxyMiddleware } from "http-proxy-middleware";

export const setupRoutes = (app) => {
  app.use(
    "/users",
    createProxyMiddleware({
      target: "http://user-service:4001",
      changeOrigin: true,
    })
  );

  app.use(
    "/activities",
    createProxyMiddleware({
      target: "http://activity-service:4002",
      changeOrigin: true,
    })
  );

  app.use(
    "/metrics",
    createProxyMiddleware({
      target: "http://health-metric-service:4003",
      changeOrigin: true,
    })
  );

  app.use(
    "/progress",
    createProxyMiddleware({
      target: "http://progress-service:4004",
      changeOrigin: true,
    })
  );
};
