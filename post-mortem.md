# Post-Mortem Report: Backend Service Outage

### 1. Summary

The backend service became completely unavailable due to container failure, resulting in total loss of API functionality while frontend remained accessible but non-functional for core features. The incident was detected within 30 seconds through user-facing errors and confirmed via monitoring systems.

### 2. Impact

- **Customer Impact:** All users were unable to view existing user data or register new users for the duration of the incident (~2 minutes). The frontend UI remained accessible but displayed error messages for all backend-dependent operations.
- **Internal Impact:** No internal systems were impacted. The incident required manual detection due to a lack of configured alerts.

### 3. Timeline of Events (UTC)

| **19:46:45** | The `backend` container was terminated manually. The service goes offline. 
 
| **19:46:55** | First API call failure, User was not able to load existing users 

| **19:47:15** | The `app_health{job="backend-metrics"}` metric reports `0`. Prometheus UI shows the target as `DOWN`. 

| **19:49:30** | initiated the restart of the service via `docker-compose up -d backend`. 

| **19:49:40** | Service restored

| **19:50:00** | Prometheus successfully scrapes the `backend` target, and the `up` metric returns to `1`. 

| **19:50:20** | Functionality is verified on the frontend. The incident is declared resolved. 

![Backend Downtime Chart](https://github.com/Goroza7/Devops-Final/blob/main/assets/Downtime.png)


### 4. Root Cause

The immediate cause of the incident was the termination of the `backend` container. The underlying root cause was a lack of a container restart policy in the `docker-compose.yml` configuration. This meant that any unexpected failure (e.g., out-of-memory error, unhandled application crash, host issue) would require manual intervention to resolve. The lack of automated alerting increased the time to detection.

### 5. Resolution

The `backend` container was manually restarted using the command `docker-compose up -d backend`. Service was fully restored once the new container was initialized and passed its first health check from Prometheus.

### 6. Lessons Learned

- The monitoring dashboards in Grafana and Prometheus were effective for quickly diagnosing the problem once it was spotted.
- The system lacked self-healing capabilities.
- The reliance on manual checks to discover a full service outage is a significant reliability risk and increases the time to resolution.

### 7. Action Items

1. Implement Restart policies for frontend and backend
2. Add Alerting rules for prometheus.
