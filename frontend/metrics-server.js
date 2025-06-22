const express = require("express");
const client = require("prom-client");
const cors = require("cors");

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "frontend-service",
});

const uptimeGauge = new client.Gauge({
  name: "process_uptime_seconds",
  help: "Uptime of the Node.js process in seconds",
});

// Update uptime periodically
setInterval(() => {
  uptimeGauge.set(process.uptime()); // built-in Node.js method: returns seconds since process started
}, 1000);
// Enable the collection of default metrics
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

// Set initial health to healthy
appHealth.set(1);

// Register the custom metrics
register.registerMetric(pageViews);
register.registerMetric(userInteractions);
register.registerMetric(uptimeGauge);
register.registerMetric(appHealth);

// Simulate some metrics data
// pageViews.inc({ page: "home" }, 5);
userInteractions.inc({ action: "button_click" }, 3);
userInteractions.inc({ action: "form_submit" }, 2);

// Create an Express server
const app = express();
const PORT = 9100;

// Middleware
app.use(cors());

// Metrics endpoint
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
