const client = require("prom-client");

// Create a Registry to register the metrics
const register = new client.Registry();

const uptimeGauge = new client.Gauge({
  name: "process_uptime_seconds",
  help: "Uptime of the Node.js process in seconds",
});

// Update uptime periodically
setInterval(() => {
  uptimeGauge.set(process.uptime()); // built-in Node.js method: returns seconds since process started
}, 1000);

// Add a default label which is added to all metrics
register.setDefaultLabels({
  app: "backend-service",
});

// Enable the collection of default metrics
client.collectDefaultMetrics({ register });

// Create a custom counter for HTTP requests
const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status_code"],
});

const appHealth = new client.Gauge({
  name: "app_health",
  help: "Health status of the application (1 = healthy, 0 = unhealthy)",
});

// Set initial health to healthy
appHealth.set(1);

// Register the custom metrics
register.registerMetric(uptimeGauge);
register.registerMetric(httpRequestsTotal);
register.registerMetric(appHealth);

module.exports = {
  register,
  httpRequestsTotal,
  appHealth,
};
