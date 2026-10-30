# CucumberCare AI — Docker & AWS EC2 Production Deployment Guide

This document describes the container architecture, environment configuration, build instructions, local verification workflow, Docker Hub image publication, and AWS EC2 production deployment steps for **CucumberCare AI**.

---

## 1. Production Architecture Overview

The system runs on a single AWS EC2 instance (recommended `t3.medium` or `t3.small` on Ubuntu 22.04 / 24.04 LTS `x86_64`) managed through **Docker Compose**:

```text
                                [ Internet / Client Browser ]
                                              │
                                              ▼ Port 80 (HTTP)
                       ┌───────────────────────────────────────────────┐
                       │          EC2 Host Security Group              │
                       │           (Allows Inbound TCP 80)             │
                       └──────────────────────┬────────────────────────┘
                                              │
                        ┌─────────────────────▼─────────────────────────┐
                        │      cucumbercare-frontend (Nginx 1.25)       │
                        │  - Serves compiled React SPA assets           │
                        │  - Handles client-side SPA routing            │
                        │  - Enforces 25MB upload limit                 │
                        │  - Proxies /api/ requests to backend          │
                        └─────────────────────┬─────────────────────────┘
                                              │
                                              │ Internal Bridge Network
                                              │ (cucumbercare_network)
                                              ▼ http://backend:8000
                        ┌───────────────────────────────────────────────┐
                        │       cucumbercare-backend (Python 3.11)       │
                        │  - FastAPI + Uvicorn server                   │
                        │  - CPU-only PyTorch & Torchvision             │
                        │  - ConvNeXt Model: ixrbhii/cucumber-disease   │
                        │  - Port 8000 internal (NOT exposed to public) │
                        └─────────────────────┬─────────────────────────┘
                                              │
                                              ▼
                             ┌─────────────────────────────────┐
                             │    cucumbercare_model_cache     │
                             │ (Docker Volume: /root/.cache)   │
                             │ Persists Hugging Face weights   │
                             └─────────────────────────────────┘
```

### Key Architectural Highlights
- **Isolated Backend**: Port 8000 is internal only (`expose: 8000`), never mapped to the public internet. All traffic passes through Nginx on Port 80.
- **CPU-Optimized Inference**: Utilizes PyTorch CPU-only wheels (`--index-url https://download.pytorch.org/whl/cpu`) reducing the image size by ~80% and removing NVIDIA GPU dependencies.
- **Persistent Model Cache**: Hugging Face downloads the 99MB ConvNeXt model weights once into a named Docker volume (`cucumbercare_model_cache`), eliminating re-downloads upon container restarts.
- **Cross-Platform Compatibility**: Supports development on Apple Silicon M-series (ARM64) while targeting `linux/amd64` AWS EC2 instances seamlessly.

---

## 2. Files Created and Modified

| File | Purpose |
| :--- | :--- |
| `backend/Dockerfile` | Production Dockerfile for FastAPI backend with Python 3.11-slim, CPU PyTorch, ConvNeXt support, and `/api/health` health check. |
| `frontend/Dockerfile` | Multi-stage Dockerfile: Stage 1 builds React SPA with Vite; Stage 2 serves production static bundle with Nginx alpine. |
| `nginx.conf` | Nginx reverse-proxy configuration forwarding `/api/` to `http://backend:8000`, 25MB body limit for leaf uploads, and SPA routing fallback. |
| `frontend/nginx.conf` | Frontend container mirror of the Nginx configuration embedded into the static image. |
| `docker-compose.yml` | Multi-container orchestration specifying `platform: linux/amd64`, health checks, volume persistence, restart policies, and isolated bridge network. |
| `.dockerignore` | Project root ignore rules preventing `node_modules`, `venv`, `.env`, dataset folders, and archives from entering build contexts. |
| `backend/.dockerignore` | Backend context ignore rules for clean Python image builds. |
| `frontend/.dockerignore` | Frontend context ignore rules excluding local `node_modules` and `dist`. |
| `backend/requirements.txt` | Cleaned and validated dependency specification (updated `google-genai` release requirement). |
| `backend/.env.example` | Template documenting mandatory and optional backend environment variables. |
| `.env.example` | Root template for Docker Compose environment variables. |
| `DOCKER_DEPLOYMENT.md` | Complete local testing, Docker Hub, and AWS EC2 deployment guide. |

---

## 3. Environment Variables Configuration

Create a `.env` file in the project root or configure your EC2 environment.

```bash
cp .env.example .env
```

### Supported Variables

| Variable | Required? | Default | Description |
| :--- | :---: | :---: | :--- |
| `GEMINI_API_KEY` | **Optional** | None | Google Gemini API key for dynamic agronomic explanations. |
| `GROQ_API_KEY` | **Optional** | None | Groq API key for LLaMA-3.3-70B agronomic fallback. |
| `PORT` | **Optional** | `8000` | Internal FastAPI server port. |
| `HOST` | **Optional** | `0.0.0.0` | Internal network binding host. |

> **Note on Resilient Fallback:** If neither `GEMINI_API_KEY` nor `GROQ_API_KEY` is provided, CucumberCare AI automatically falls back to its built-in botanical pathology knowledge base. The application functions 100% offline without failing.

---

## 4. Local Build & Run Instructions

### Step 1: Validate Compose Configuration
```bash
docker compose config
```

### Step 2: Build the Docker Images
To build the images locally targeting `linux/amd64` (compatible with EC2):
```bash
docker compose build
```

### Step 3: Start the Application Containers
```bash
docker compose up -d
```

### Step 4: Verify Container Status
```bash
docker compose ps
```
Both `cucumbercare-backend` and `cucumbercare-frontend` should report status `Up` (with backend reporting `healthy`).

---

## 5. Local Verification & Testing

### 1. Test Backend Health Check
```bash
curl -f http://localhost/api/health
```
**Expected Response:**
```json
{
  "status": "healthy",
  "model": "hf-hub:ixrbhii/cucumber-disease-convnext",
  "device": "cpu",
  "num_classes": 8,
  "classes": [
    "Angular Leaf Spot",
    "Anthracnose",
    "Bacterial Wilt",
    "Downy Mildew",
    "Gummy Stem Blight",
    "Healthy Leaves",
    "Nutrient Deficiency",
    "Powdery Mildew"
  ]
}
```

### 2. Test Frontend Delivery
Open your browser and navigate to:
```text
http://localhost
```
You should see the CucumberCare AI landing page and diagnosis workspace.

### 3. Test Disease Prediction Proxy & Model Inference
```bash
curl -X POST \
  -F "file=@frontend/public/samples/healthy_sample.jpg" \
  http://localhost/api/predict
```
The response will contain the ConvNeXt classification output, confidence metrics, and agronomic guidance.

---

## 6. Managing Containers & Inspecting Logs

### View Real-Time Combined Logs
```bash
docker compose logs -f
```

### View Service-Specific Logs
```bash
# Backend logs
docker compose logs -f backend

# Frontend Nginx access/error logs
docker compose logs -f frontend
```

### Stop Containers
```bash
docker compose down
```

### Stop and Wipe Persisted Volumes (Clean Reset)
```bash
docker compose down -v
```

### Restart Services
```bash
docker compose restart
```

---

## 7. Pushing Images to Docker Hub

Replace `<your-dockerhub-username>` with your actual Docker Hub username.

### Step 1: Log in to Docker Hub
```bash
docker login
```

### Step 2: Build and Tag Images for AMD64
On an Apple Silicon Mac (M1/M2/M3/M4), use `docker buildx` to guarantee explicit `linux/amd64` binaries:

```bash
# Set your Docker Hub username
export DOCKERHUB_USER="<your-dockerhub-username>"

# Build & Push Backend for linux/amd64
docker buildx build \
  --platform linux/amd64 \
  -t ${DOCKERHUB_USER}/cucumbercare-backend:latest \
  -t ${DOCKERHUB_USER}/cucumbercare-backend:v2.0 \
  -f backend/Dockerfile \
  ./backend \
  --push

# Build & Push Frontend for linux/amd64
docker buildx build \
  --platform linux/amd64 \
  -t ${DOCKERHUB_USER}/cucumbercare-frontend:latest \
  -t ${DOCKERHUB_USER}/cucumbercare-frontend:v2.0 \
  -f frontend/Dockerfile \
  ./frontend \
  --push
```

*(Alternatively, if you already built them locally with compose, tag and push directly:)*
```bash
docker tag cucumbercare-backend:latest ${DOCKERHUB_USER}/cucumbercare-backend:latest
docker tag cucumbercare-frontend:latest ${DOCKERHUB_USER}/cucumbercare-frontend:latest

docker push ${DOCKERHUB_USER}/cucumbercare-backend:latest
docker push ${DOCKERHUB_USER}/cucumbercare-frontend:latest
```

---

## 8. AWS EC2 Production Deployment Step-by-Step

### Step 1: Launch an AWS EC2 Instance
- **AMI**: Ubuntu 24.04 LTS or 22.04 LTS (x86_64 / amd64).
- **Instance Type**: `t3.medium` (2 vCPU, 4GB RAM recommended for smooth PyTorch CPU inference) or `t3.small` (2 vCPU, 2GB RAM minimum).
- **Storage**: 20 GB gp3 EBS volume.
- **Security Group**:
  - Inbound **Port 22 (SSH)**: Your IP only.
  - Inbound **Port 80 (HTTP)**: `0.0.0.0/0` (Anywhere).
  - Inbound **Port 443 (HTTPS)**: `0.0.0.0/0` (Anywhere, if using SSL).
  - *Do NOT open port 8000 to the public.*

### Step 2: Connect to Your EC2 Instance
```bash
ssh -i /path/to/your-key.pem ubuntu@<your-ec2-public-ip>
```

### Step 3: Install Docker and Docker Compose on Ubuntu
Run the official Docker installation script:
```bash
sudo apt-get update
sudo apt-get install -y ca-certificates curl gnupg

# Add Docker GPG key and repository
sudo install -m 0755 -d /etc/apt/keyrings
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
sudo chmod a+r /etc/apt/keyrings/docker.gpg

echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

sudo apt-get update
sudo apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# Enable Docker without sudo for ubuntu user
sudo usermod -aG docker ubuntu
newgrp docker
```

### Step 4: Create the Production Deployment Directory
On EC2, create a clean directory:
```bash
mkdir -p ~/cucumbercare && cd ~/cucumbercare
```

### Step 5: Create Production `docker-compose.yml` on EC2
Create a lightweight `docker-compose.yml` pulling your pre-built Docker Hub images:

```bash
cat << 'EOF' > docker-compose.yml
services:
  backend:
    image: <your-dockerhub-username>/cucumbercare-backend:latest
    container_name: cucumbercare-backend
    restart: unless-stopped
    expose:
      - "8000"
    environment:
      - GEMINI_API_KEY=${GEMINI_API_KEY:-}
      - GROQ_API_KEY=${GROQ_API_KEY:-}
      - PORT=8000
      - HOST=0.0.0.0
      - HF_HOME=/root/.cache/huggingface
    volumes:
      - model_cache:/root/.cache/huggingface
    healthcheck:
      test: ["CMD-SHELL", "curl -f http://localhost:8000/api/health || exit 1"]
      interval: 15s
      timeout: 10s
      retries: 3
      start_period: 30s
    networks:
      - cucumbercare-net

  frontend:
    image: <your-dockerhub-username>/cucumbercare-frontend:latest
    container_name: cucumbercare-frontend
    restart: unless-stopped
    ports:
      - "80:80"
    depends_on:
      backend:
        condition: service_healthy
    networks:
      - cucumbercare-net

volumes:
  model_cache:
    name: cucumbercare_model_cache
    driver: local

networks:
  cucumbercare-net:
    name: cucumbercare_network
    driver: bridge
EOF
```

*(Remember to replace `<your-dockerhub-username>` with your actual Docker Hub username).*

### Step 6: Create `.env` on EC2 (Optional)
```bash
cat << 'EOF' > .env
GEMINI_API_KEY=your_actual_gemini_key_if_desired
GROQ_API_KEY=your_actual_groq_key_if_desired
EOF
```

### Step 7: Pull Images and Launch Services
```bash
docker compose pull
docker compose up -d
```

### Step 8: Verify Live Deployment
```bash
# Check container health status
docker compose ps

# Check backend health via Nginx
curl -f http://localhost/api/health
```

Navigate to `http://<your-ec2-public-ip>` in your web browser. The CucumberCare AI application is now running live in production!
