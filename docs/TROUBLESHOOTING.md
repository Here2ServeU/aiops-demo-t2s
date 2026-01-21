# Troubleshooting Guide

If you encounter issues while deploying or running the AIOps platform, refer to the common scenarios and solutions below.

## **1. Docker & Container Issues**

### **Port Already in Use**

* **Symptom:** Error message stating `Bind for 0.0.0.0:3000 failed: port is already allocated`.
* **Cause:** Another application is already using a required port (3000, 3001, 9090, or 9093).
* **Solution:** Identify and stop the process using the port:
* **Mac/Linux:** `lsof -i :3000` then `kill -9 <PID>`
* **Windows (CMD):** `netstat -ano | findstr :3000` then `taskkill /PID <PID> /F`



### **Container Fails to Start**

* **Symptom:** A specific container shows a status of `Exited`.
* **Solution:** Check the logs for that specific container:
```bash
docker compose logs <container_name>

```



---

## **2. Prometheus Connection Errors**

### **Targets are "DOWN"**

* **Symptom:** In the Prometheus UI (**Status > Targets**), the endpoint for `express-app` shows as **DOWN**.
* **Cause:** The application container failed or Prometheus cannot reach the internal Docker network.
* **Solution:**
1. Ensure the app is running: `docker compose ps`.
2. Check that the `prometheus.yml` uses the service name (e.g., `http://express-app:3000/metrics`) rather than `localhost`.



### **No Data in Dashboards**

* **Symptom:** Grafana shows "No Data" or "Panel Error."
* **Solution:**
1. Verify Prometheus has data by querying `http_requests_total` in the Prometheus UI (`http://localhost:9090`).
2. Ensure the **Datasource** in Grafana is pointing to the correct Prometheus URL: `http://prometheus:9090`.



---

## **3. Alerting & Slack Issues**

### **Slack Messages Not Received**

* **Symptom:** Alerts fire in Prometheus, but no notification appears in Slack.
* **Solution:**
1. **Validate Webhook:** Ensure your `.env` file contains the correct URL from the [Slack Apps Dashboard](https://api.slack.com/apps).
2. **Check Bridge Logs:** Verify the webhook receiver is processing requests:
```bash
docker compose logs webhook-receiver

```


3. **Test Connectivity:** Manually trigger a test message using `curl`:
```bash
curl -X POST -H 'Content-type: application/json' --data '{"text":"Test Alert"}' YOUR_SLACK_WEBHOOK_URL

```


