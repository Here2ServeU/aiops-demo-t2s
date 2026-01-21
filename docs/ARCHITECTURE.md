## 📂 Comprehensive File Directory

### 1. The Core Infrastructure
* **`docker-compose.yml`**: The "orchestrator." It defines and connects all six services (App, Prometheus, Grafana, Alertmanager, Webhook Receiver, and Redis/State) over a shared virtual network.
* **`.env.example`**: A template for environment variables. Copy this to `.env` to configure your `SLACK_WEBHOOK_URL`.

### 2. The Application (`/app`)
* **`app/index.js`**: A Node.js Express application representing our "production" environment. It uses `prom-client` to export metrics like `http_requests_total`.
* **`app/Dockerfile`**: Build instructions for the application container.
* **`app/package.json`**: Defines dependencies, including `express` and `prom-client`.

### 3. Monitoring & Alerting (`/prometheus`)
* **`prometheus/prometheus.yml`**: Configures Prometheus to "scrape" data from the App and Webhook Receiver at defined intervals.
* **`prometheus/rules.yml`**: Contains alerting logic (e.g., triggering a "crisis" if the error rate exceeds 5%).

### 4. Visualization (`/grafana`)
* **`grafana/provisioning/`**: Automates setup by connecting the Prometheus datasource and loading pre-built dashboards.
* **`grafana/dashboards/aiops-demo-dashboard.json`**: The visual layer showing real-time request rates, error percentages, and system health.

### 5. Notification Bridge (`/webhook-receiver`)
* **`webhook-receiver/server.js`**: A microservice that translates Prometheus alerts into Slack-compatible notifications.

### 6. The AIOps Engine (`/scripts`)
* **`scripts/aiops_recommend.py`**: The "Brain." It queries Prometheus to diagnose alerts and posts plain-English recommendations to Slack.
* **`scripts/approve.sh`**: The "Human-in-the-loop" gate that verifies a pending recommendation before execution.
* **`scripts/remediate.sh`**: The script that performs the actual fix, such as restarting containers.
* **Stress Scripts**: (`stress_traffic.sh`, `stress_error.sh`, `stress_cpu.sh`) Tools to simulate system failures for testing.

### 7. Persistent State (`/state`)
* **`state/.gitkeep`**: Ensures the folder exists for storing "pending" AI actions, maintaining system memory between script runs.

