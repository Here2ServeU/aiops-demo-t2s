# AIOps Demo: Full Technical Architecture & File Guide

This repository is a containerized, end-to-end AIOps ecosystem. It demonstrates how to move from **incident detection** to **AI-assisted recommendation** and **human-approved remediation**.

## Comprehensive File Directory

### 1. The Core Infrastructure

* **`docker-compose.yml`**: The "orchestrator." It defines and connects all six services (App, Prometheus, Grafana, Alertmanager, Webhook Receiver, and Redis/State). It ensures they can communicate over a shared virtual network.
* **`.env.example`**: A template for your environment variables. You must copy this to `.env` to store your `SLACK_WEBHOOK_URL` securely.

### 2. The Application (`/app`)

* **`app/index.js`**: A Node.js Express application that serves as our "production" website. It includes custom instrumentation to export metrics like `http_requests_total`.
* **`app/Dockerfile`**: Instructions for building the application image.
* **`app/package.json`**: Lists dependencies, specifically `prom-client` for metrics and `express` for the web server.

### 3. Monitoring & Alerting (`/prometheus`)

* **`prometheus/prometheus.yml`**: The configuration file that tells Prometheus where to "scrape" data (from our App and Webhook Receiver) and how often.
* **`prometheus/rules.yml`**: Contains the **Alerting Rules**. It defines the logic for what constitutes a "crisis" (e.g., if the error rate exceeds 5% or CPU usage is too high).

### 4. Visualization (`/grafana`)

* **`grafana/provisioning/`**: Automates the setup so you don't have to configure Grafana manually.
* **`datasources/datasource.yml`**: Automatically connects Grafana to Prometheus as the data source.
* **`dashboards/dashboards.yml`**: Tells Grafana to look in the `/dashboards` folder for pre-made layouts.


* **`grafana/dashboards/aiops-demo-dashboard.json`**: A pre-built dashboard that displays request rates, error percentages, and system health in real-time.

### 5. Notification Bridge (`/webhook-receiver`)

* **`webhook-receiver/server.js`**: A specialized microservice that listens for alerts from Alertmanager and translates them into a format that **Slack** understands.
* **`webhook-receiver/Dockerfile`**: Builds the environment for the bridge service.

### 6. The AIOps Engine (`/scripts`)

* **`scripts/aiops_recommend.py`**: The "Brain." This Python script queries the Prometheus API to see *exactly* why an alert fired. It then uses logic to post a plain-English recommendation to Slack (e.g., *"I see high CPU; I recommend a restart"*).
* **`scripts/approve.sh`**: The "Human-in-the-loop" gate. It checks for a pending recommendation in the `state/` folder and, if found, executes the fix.
* **`scripts/remediate.sh`**: The actual "Fix-it" script. It contains the commands to restart containers or clear caches.
* **Stress Scripts (`stress_traffic.sh`, `stress_error.sh`, `stress_cpu.sh`)**: Tools used to intentionally "break" the app so you can watch the AIOps system work.

### 7. Persistent State (`/state`)

* **`state/.gitkeep`**: A placeholder folder where the AI stores "pending" actions. This ensures the system remembers a recommendation even if the script finishes running.

