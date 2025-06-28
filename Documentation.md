## Security Implementation

A proactive approach to security was taken throughout the project lifecycle, focusing on identifying and remediating vulnerabilities within the containerized services.

### Vulnerability Scanning with Trivy

The Docker images for both the `frontend` and `backend` services were scanned for known vulnerabilities using **Trivy**, a comprehensive open-source security scanner. The initial scans of the `node:18`-based images revealed several vulnerabilities, including two high-severity issues:

- **`braces` (CVE-2024-4068)**: A Regular Expression Denial of Service (ReDoS) vulnerability found in the frontend service, where the `braces` package failed to limit the number of characters it could handle in version 2.3.2.
- **`cross-spawn` (CVE-2024-21538)**: A similar ReDoS vulnerability found in both frontend and backend services affecting version 7.0.3.

### Key Security Improvements

To address the findings and enhance the overall security posture, the following key improvements were implemented:

1.  **Upgraded Node.js Version**: The Docker base images were upgraded from `node:18` to **`node:24-alpine`**. This immediately resolved many inherited vulnerabilities by leveraging a more recent and patched version of the Node.js runtime.
2.  **Dependency Overrides**: For vulnerabilities that could not be fixed by a direct `npm update`, the `overrides` feature in `package.json` was used to force the installation of patched versions of transitive dependencies.
3.  **Multi-Stage Builds**: By using multi-stage builds, the final production images are kept minimal, containing only the necessary application code and production dependencies. This drastically reduces the attack surface by excluding build tools and development packages.
4.  **Non-Root Containers**: Both services are configured to run as a non-root `nodejs` user inside the container, a critical security best practice that mitigates the risk of privilege escalation.

### Current Results

Following the implementation of these security measures, the high-severity vulnerabilities (CVE-2024-4068 and CVE-2024-21538) have been successfully **remediated**. The final container images are now significantly more secure.

### Security Scan Results

The following screenshots show the "before" vulnerability scans, highlighting the successful remediation, after that trivy returned 0 vulnerabilities.
## Frontend Vulnerabilities
![Frontend vulnerabilities](https://github.com/Goroza7/Devops-Final/blob/main/assets/Frontendvuln.png)
## Backend Vulnerabilities
![Backend vulnerabilities](https://github.com/Goroza7/Devops-Final/blob/main/assets/Backendvuln.png)
