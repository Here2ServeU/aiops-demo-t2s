const express = require("express");
const client = require("prom-client");

const app = express();
const port = process.env.PORT || 3000;

// Prometheus metrics
client.collectDefaultMetrics();

const register = client.register;
const httpRequestDuration = new client.Histogram({
  name: "http_request_duration_seconds",
  help: "HTTP request duration in seconds",
  labelNames: ["method", "route", "status"],
  buckets: [0.01, 0.05, 0.1, 0.25, 0.5, 1, 2, 5]
});

const httpRequestsTotal = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "status"]
});

const demoBurnGauge = new client.Gauge({
  name: "demo_cpu_burn_active",
  help: "1 when /burn is actively burning CPU, else 0"
});

// Helper: randomly return 500 to simulate errors
function maybeError(rate = 0.3) {
  return Math.random() < rate;
}

// Middleware to capture duration
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on("finish", () => {
    const route = req.route?.path || req.path || "unknown";
    const status = String(res.statusCode);
    httpRequestsTotal.inc({ method: req.method, route, status });
    end({ method: req.method, route, status });
  });
  next();
});

app.get("/", (req, res) => {
  res.json({ message: "AIOps demo app is running", time: new Date().toISOString() });
});

app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Endpoint that returns errors randomly (for alert demo)
app.get("/error", (req, res) => {
  const rate = Number(req.query.rate ?? "0.5");
  if (maybeError(rate)) {
    return res.status(500).json({ status: "error", message: "Simulated 500 error" });
  }
  res.json({ status: "ok", message: "Simulated endpoint - no error this time" });
});

// CPU burn endpoint (for alert demo)
app.get("/burn", async (req, res) => {
  const seconds = Math.min(Math.max(Number(req.query.seconds ?? "10"), 1), 60);
  demoBurnGauge.set(1);
  const start = Date.now();
  while (Date.now() - start < seconds * 1000) {
    // Busy loop (CPU burn)
    Math.sqrt(Math.random() * 1000000);
  }
  demoBurnGauge.set(0);
  res.json({ status: "ok", burned_seconds: seconds });
});

app.get("/metrics", async (req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

app.listen(port, () => {
  console.log(`AIOps demo app listening on port ${port}`);
});
