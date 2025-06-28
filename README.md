# Full-Stack Application with Monitoring and Alerting

This project is a containerized full-stack JavaScript application featuring a Node.js backend, a static frontend, and a monitoring setup using Prometheus and Grafana.

## Project Overview

The application consists of a backend API service that manages user data and a user-friendly frontend to interact with it. Both services are instrumented to expose Prometheus metrics, providing insights into their health and performance. The entire stack is orchestrated with Docker Compose.

### Key Features:

- **Backend**: Node.js with Express, serving a RESTful API for user management.
- **Frontend**: A static HTML/CSS/JS application for user interaction.
- **Monitoring**: Prometheus for metrics collection and Grafana for visualization.
- **Alerting**: Pre-configured alert rules for service availability.
- **Containerization**: Fully containerized services for easy deployment and scaling.

### Running the Application

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Goroza7/Devops-Final.git
    cd Devops-final
    ```

2.  **Create an `.env` file:**
    Create a `.env` file in the root of the project and add the Grafana admin password:

    ```
    GF_SECURITY_ADMIN_PASSWORD=your_password
    ```

3.  **Build and run the containers:**

    ```bash
    docker-compose up -d
    ```

4.  **Access the services:**

    - **Frontend Application**: [http://localhost:3000](http://localhost:3000)
    - **Backend API Health**: [http://localhost:3001/api/health](http://localhost:3001/api/health)
    - **Backend API Users**: [http://localhost:3001/api/users](http://localhost:3001/api/users) (or instead of users id of your liking)
    - **Prometheus UI**: [http://localhost:9090](http://localhost:9090)
    - **Grafana Dashboard**: [http://localhost:3030](http://localhost:3030) (Login with `admin` and the password from your `.env` file).

    ## Docker Containerization

### Docker Compose Architecture

The entire application stack is defined and managed by the `docker-compose.yml` file, which orchestrates four main services:

- **`backend`**: The Node.js API server.
- **`frontend`**: The static web application server.
- **`prometheus`**: The metrics collection and storage service.
- **`grafana`**: The data visualization and dashboarding service.

These services communicate with each other over a custom Docker network (`app-network`), ensuring they can securely resolve each other by their service names (e.g., Grafana connects to `http://prometheus:9090`).

### Docker Images Strategy

The Docker images for the `frontend` and `backend` services are built using a **multi-stage build** strategy to create lean, secure, and optimized production images.

1.  **Build Stage**: This stage uses a full `node:24` image to install all dependencies (including `devDependencies`) and build the application assets.
2.  **Production Stage**: This stage starts from a minimal `node:24-alpine` base image. It copies only the necessary production-ready files (like `node_modules` and the built source code) from the build stage.

This approach significantly reduces the final image size and attack surface by excluding build tools, compilers, and extraneous files.

### Frontend Service

The frontend is a static single-page application built with HTML, CSS, and JavaScript. It is served by a lightweight Node.js server and is instrumented to expose its own metrics to Prometheus, including user interactions and page views.

### Container Security

Security has been a key consideration in the containerization process:

- **Multi-Stage Builds**: As described above, this is a primary security measure to prevent shipping unnecessary tools or source code in the final images.
- **Minimal Base Images**: The use of `alpine` as a base for the production images reduces the number of pre-installed packages, minimizing potential vulnerabilities.
- **Non-Root User**: Both the `frontend` and `backend` containers are configured to run as a non-root `nodejs` user. This is a critical security practice that limits the potential damage if a process within the container is compromised.
- **Environment Variable Injection**: Secure configuration management via `.env` file
- **Vulnerability Scanning**: The `frontend` and `backend` images were scanned using **Trivy**. The scans identified two high-severity vulnerabilities:

  - **`braces` (CVE-2024-4068)**
  - **`cross-spawn` (CVE-2024-21538)**
    (For more see Documentation.md)

  These and other lower-severity vulnerabilities were remediated by overriding the dependency versions with fixed versions in each service's `package.json` file.

## Monitoring and Alerting

### Prometheus

Prometheus is configured to scrape metrics from both the `backend` and `frontend` services. Key metrics include:

- `user_interaction': total number of users interacting with application(pressing the buttons)`
- `up`: Service availability.
- `process_uptime_seconds`: Uptime of the service.
- `app_health`: Custom health metric (1 for healthy, 0 for unhealthy).
- `Default prometheus metrics like procces_cpu_usage`

### Grafana

Grafana provides a visualization layer for the metrics collected by Prometheus. Here I created dashboards for app_health, memory usage, cpu usage, uptime and user_interactions.

### Alerting

Prometheus is configured with alerting rules to notify when a service is down. These rules are defined in `prometheus/alert-rules.yml` and will fire if a service is unavailable for more than one minute.

- **`BackendDown`**: Fires when the backend service is down for 1 minute.
- **`FrontendDown`**: Fires when the frontend service is down for 1 minute.

### Grafana dashboards
## Application Cpu and Memory Usage
![Application Cpu and Memory Usage](https://github.com/Goroza7/Devops-Final/blob/main/assets/CPU&Memory.png)
## Uptime and status of application
![Uptime and status of application](https://github.com/Goroza7/Devops-Final/blob/main/assets/uptime&status.png)
## Frontend mentrics: user interaction and page views
![User interaction and Page views](https://github.com/Goroza7/Devops-Final/blob/main/assets/interaction&views.png)
## System Cpu, Memory usage and Uptime
![System Cpu, and Uptime](<https://github.com/Goroza7/Devops-Final/blob/main/assets/cpu&memory(system).png>)
