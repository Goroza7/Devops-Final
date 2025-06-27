const express = require("express");
const client = require("prom-client");
const cors = require("cors");

const register = new client.Registry();

register.setDefaultLabels({
  app: "frontend-service",
});

const uptimeGauge = new client.Gauge({
  name: "process_uptime_seconds",
  help: "Uptime of the Node.js process in seconds",
});

setInterval(() => {
  uptimeGauge.set(process.uptime());
}, 1000);
client.collectDefaultMetrics({ register });

// Create custom metrics
const pageViews = new client.Counter({
  name: "frontend_page_views",
  help: "Total number of page views",
  labelNames: ["page"],
});

const userInteractions = new client.Counter({
  name: "frontend_user_interactions",
  help: "Total number of user interactions",
  labelNames: ["action"],
});

const appHealth = new client.Gauge({
  name: "app_health",
  help: "Health status of the application (1 = healthy, 0 = unhealthy)",
});

appHealth.set(1);

// Register the custom metrics
register.registerMetric(pageViews);
register.registerMetric(userInteractions);
register.registerMetric(uptimeGauge);
register.registerMetric(appHealth);

const app = express();
const PORT = 9100;

app.use(cors());

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({ status: "Frontend metrics server is running" });
});

app.post("/pageview", (req, res) => {
  const page = req.query.page || "unknown";
  pageViews.inc({ page });
  res.sendStatus(204);
});

app.post("/userinteraction", (req, res) => {
  const action = req.query.action || "unknown";
  userInteractions.inc({ action });
  res.sendStatus(204);
});

// Start the server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Frontend metrics server running on port ${PORT}`);
});
