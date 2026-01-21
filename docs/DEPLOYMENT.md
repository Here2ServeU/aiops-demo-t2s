# Deployment & Validation Guide

Follow these steps to deploy the AIOps platform and verify that every component is communicating correctly.

## **Step 1: Environment Setup**

Before launching the containers, you must configure your Slack integration.

1. Copy the example environment file: `cp .env.example .env`
2. Open `.env` and paste your **Slack Webhook URL**.
3. (Optional) Ensure ports `3000`, `3001`, `9090`, and `9093` are not being used by other local applications.

## **Step 2: Launch the Platform**

Run the following command to build the images and start the services in the background:

```bash
docker compose up -d --build

```

## **Step 3: Validation Checklist**

Verify that all services are live by visiting these URLs in your browser:

| Service | URL | Validation Action |
| --- | --- | --- |
| **Express App** | `http://localhost:3000` | Should show "App is Running." Check `/metrics` for data. |
| **Prometheus** | `http://localhost:9090` | Go to **Status > Targets**; all endpoints should be **UP**. |
| **Grafana** | `http://localhost:3001` | Login (`admin/admin`). Open the **AIOps Demo Dashboard**. |
| **Alertmanager** | `http://localhost:9093` | Should load an empty alerts page (baseline). |

## **Step 4: End-to-End Test (The "Smoke Test")**

To ensure the AIOps engine is working, run a controlled error spike:

1. **Trigger Errors:** `bash scripts/stress_error.sh`
2. **Wait 60 Seconds:** Check the [Grafana](https://github.com/Here2ServeU/aiops-demo-t2s/blob/main/docs/ARCHITECTURE.md) dashboard to see the error percentage rise.
3. **Check Slack:** You should receive an alert notification.
4. **Run Recommender:** `python3 scripts/aiops_recommend.py`. Check Slack for the AI's "Fix" suggestion.
5. **Approve Fix:** `bash scripts/approve.sh`.
6. **Verify Recovery:** Watch the Grafana dashboard return to a "Healthy" green state.

