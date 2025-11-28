import { createProxyMiddleware } from "http-proxy-middleware";

export const setupRoutes = (app) => {
  app.use(
    "/users",
    createProxyMiddleware({
      target: "http://localhost:4001",
      changeOrigin: true,
      followRedirects: true,
      pathRewrite: { "^/users": "" },
      logLevel: "debug",

    })
  );

  app.use(
    "/activities",
    createProxyMiddleware({
      target: "http://localhost:4002",
      changeOrigin: true,
      followRedirects: true,
      pathRewrite: { "^/activities": "" },
    })
  );

  app.use(
    "/metrics",
    createProxyMiddleware({
      target: "http://localhost:4003",
      changeOrigin: true,
      followRedirects: true,
      pathRewrite: { "^/metrics": "" },
    })
  );

  app.use(
    "/progress",
    createProxyMiddleware({
      target: "http://localhost:4004",
      changeOrigin: true,
      followRedirects: true,
      pathRewrite: { "^/progress": "" },
    })
  );
};
