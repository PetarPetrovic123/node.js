// api-gateway.js
import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import cookieParser from "cookie-parser";

const app = express();
app.use(cookieParser());

// Services URLs
const AUTH_SERVICE = "http://localhost:5001";
const PASSWORD_SERVICE = "http://localhost:5002";
const ADMIN_SERVICE = "http://localhost:5003";
const BLOG_SERVICE = "http://localhost:5004";

// Forward requests to Auth Service
app.use(
  "/auth",
  createProxyMiddleware({
    target: AUTH_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/auth": "" },
  })
);

// Forward requests to Password Service
app.use(
  "/password",
  createProxyMiddleware({
    target: PASSWORD_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/password": "" },
  })
);

// Forward requests to Admin Service
app.use(
  "/admin",
  createProxyMiddleware({
    target: ADMIN_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/admin": "" },
  })
);

app.use(
  "/blog",
  createProxyMiddleware({
    target: BLOG_SERVICE,
    changeOrigin: true,
    pathRewrite: { "^/blog": "" },
  })
);

app.listen(5000, () => {
  console.log("API Gateway listening on port 5000");
});
