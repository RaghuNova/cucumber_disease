# Complete AWS EC2 Deployment Guide: CucumberCare AI

A comprehensive, step-by-step production deployment guide for hosting both the **React 19 Frontend** and the **FastAPI + PyTorch ConvNeXt Backend** of **CucumberCare AI** on a single **Amazon Web Services (AWS) EC2 instance** using Docker and Docker Compose.

---

## Table of Contents
1. [Architecture Overview](#1-architecture-overview)
2. [EC2 Instance Sizing & Cost Recommendation](#2-ec2-instance-sizing--cost-recommendation)
3. [AWS Console Setup (Step-by-Step)](#3-aws-console-setup-step-by-step)
   - [3.1 Launch EC2 Instance](#31-launch-ec2-instance)
   - [3.2 Configure Security Group](#32-configure-security-group)
   - [3.3 Allocate & Attach an Elastic IP](#33-allocate--attach-an-elastic-ip)
4. [Connecting to Your EC2 Instance](#4-connecting-to-your-ec2-instance)
5. [Server Provisioning & Optimization](#5-server-provisioning--optimization)
   - [5.1 Update System Packages](#51-update-system-packages)
   - [5.2 Add 4GB Swap Space (Critical for AI/PyTorch)](#52-add-4gb-swap-space-critical-for-aipytorch)
   - [5.3 Install Docker & Docker Compose Plugin](#53-install-docker--docker-compose-plugin)
6. [Deploying Frontend & Backend Application](#6-deploying-frontend--backend-application)
   - [Option A: Deploy via Git (Recommended)](#option-a-deploy-via-git-recommended)
   - [Option B: Deploy via SCP / Local Transfer](#option-b-deploy-via-scp--local-transfer)
   - [Option C: Deploy via Pre-built Docker Hub Images](#option-c-deploy-via-pre-built-docker-hub-images)
7. [Environment Configuration](#7-environment-configuration)
8. [Building & Launching the Containers](#8-building--launching-the-containers)
9. [Verifying the Deployment](#9-verifying-the-deployment)
10. [Setting Up Custom Domain & Free SSL (HTTPS)](#10-setting-up-custom-domain--free-ssl-https)
11. [Production Operations & Maintenance Commands](#11-production-operations--maintenance-commands)
12. [Troubleshooting & FAQs](#12-troubleshooting--faqs)

---

## 1. Architecture Overview

Both services run side-by-side inside isolated Docker containers on a single EC2 host, connected through a private Docker bridge network:

```text
                           [ Client Browser / Web ]
                                       │
                                       ▼ HTTP (Port 80) / HTTPS (Port 443)
                 ┌─────────────────────────────────────────────────────────┐
                 │                AWS EC2 Security Group                   │
                 │         Allows Ports 22 (SSH), 80 (HTTP), 443 (HTTPS)   │
                 └─────────────────────────┬───────────────────────────────┘
                                           │
                 ┌─────────────────────────▼───────────────────────────────┐
                 │       Container 1: cucumbercare-frontend (Nginx)        │
                 │  - Serves compiled React 19 SPA static assets           │
                 │  - Handles client-side routing                          │
                 │  - Proxies all /api/* calls to backend container        │
                 │  - Handles 25MB max file upload limit for leaf images   │
                 └─────────────────────────┬───────────────────────────────┘
                                           │
                                           │ Internal Docker Network
                                           │ http://backend:8000
                                           ▼
                 ┌─────────────────────────────────────────────────────────┐
                 │       Container 2: cucumbercare-backend (FastAPI)       │
                 │  - Python 3.11 with CPU-only PyTorch & timm             │
                 │  - ConvNeXt Model: ixrbhii/cucumber-disease             │
                 │  - Language Advisory Engine (Gemini / Groq / Fallback)  │
                 │  - Kannada Audio Narration & PDF Diagnostic Generator   │
                 │  - Port 8000 is internal ONLY (Never exposed to public) │
                 └─────────────────────────┬───────────────────────────────┘
                                           │
                                           ▼
                 ┌─────────────────────────────────────────────────────────┐
                 │       Docker Named Volume: cucumbercare_model_cache     │
                 │       Persists downloaded Hugging Face weights to disk  │
                 └─────────────────────────────────────────────────────────┘
```

### Why this architecture is ideal:
- **No CORS Issues**: Because Nginx acts as a reverse proxy, both frontend and backend are served from the same domain/IP on port 80.
- **Enhanced Security**: Port 8000 (FastAPI) is kept completely private inside Docker and cannot be accessed directly from the internet.
- **Cost-Efficient**: Both services share a single compute instance without needing expensive separate servers or load balancers.
- **Persistent Model Cache**: Hugging Face weights (~99MB) are saved in a Docker volume, so they are not re-downloaded when containers restart.

---

## 2. EC2 Instance Sizing & Cost Recommendation

The PyTorch ConvNeXt classifier runs efficiently on CPU using optimized CPU wheels.

| Specification | Recommended (Best Performance) | Minimum Budget Option |
| :--- | :--- | :--- |
| **Instance Type** | `t3.medium` | `t3.small` |
| **vCPU** | 2 vCPUs | 2 vCPUs |
| **RAM** | 4 GiB | 2 GiB *(requires 4GB Swap)* |
| **Architecture** | 64-bit (x86_64) | 64-bit (x86_64) |
| **OS / AMI** | Ubuntu Server 24.04 LTS (x86_64) | Ubuntu Server 24.04 LTS (x86_64) |
| **Storage** | 25 GiB gp3 EBS Volume | 20 GiB gp3 EBS Volume |
| **Approx. Cost** | ~$30 / month (~$0.0416/hr) | ~$15 / month (~$0.0208/hr) |

> **Important**: Always choose **x86_64 / amd64** for the AMI architecture. The Docker files and PyTorch CPU wheels are compiled for `linux/amd64`.

---

## 3. AWS Console Setup (Step-by-Step)

### 3.1 Launch EC2 Instance

1. Log in to the [AWS Management Console](https://console.aws.amazon.com/ec2/).
2. Select your preferred **AWS Region** (e.g., `us-east-1` (N. Virginia), `ap-south-1` (Mumbai), or `eu-central-1` (Frankfurt)).
3. Navigate to **EC2 Dashboard** and click **Launch Instance**.
4. Configure the following fields:
   - **Name and tags**: `cucumbercare-production`
   - **Application and OS Images (Amazon Machine Image)**:
     - Select **Ubuntu**.
     - AMI: **Ubuntu Server 24.04 LTS (HVM), SSD Volume Type** (or 22.04 LTS).
     - Architecture: **64-bit (x86)**.
   - **Instance Type**:
     - Select **t3.medium** (or **t3.small**).
   - **Key pair (login)**:
     - Click **Create new key pair**.
     - Name: `cucumbercare-key`
     - Key pair type: **RSA**
     - Private key file format: **.pem** (for OpenSSH on macOS/Linux/Windows PowerShell).
     - Click **Create key pair** and save the downloaded `cucumbercare-key.pem` file in a safe folder on your computer (e.g. `~/.ssh/` or `~/Downloads/`).

### 3.2 Configure Security Group

In the **Network settings** section during launch:
1. Select **Create security group**.
2. Check the boxes:
   - [x] **Allow SSH traffic from** -> Select **My IP** (or Anywhere `0.0.0.0/0` if you have a dynamic IP).
   - [x] **Allow HTTP traffic from the internet** (`0.0.0.0/0`, Port 80).
   - [x] **Allow HTTPS traffic from the internet** (`0.0.0.0/0`, Port 443).

Your Security Group Inbound rules will look like:

| Type | Protocol | Port Range | Source | Description |
| :--- | :--- | :--- | :--- | :--- |
| **SSH** | TCP | `22` | `My IP` / `0.0.0.0/0` | Secure terminal management |
| **HTTP** | TCP | `80` | `0.0.0.0/0` | Public web application traffic |
| **HTTPS**| TCP | `443`| `0.0.0.0/0` | Secure SSL/TLS web traffic |

> **Security Note:** Do **NOT** add port 8000 to the inbound rules. FastAPI is safely reached only through Nginx on port 80.

### 3.3 Configure Storage
In **Configure storage**:
- Set size to **25 GiB** (General Purpose SSD **gp3**).
- Click **Launch instance**.

### 3.4 Allocate & Attach an Elastic IP (Static Public IP)

By default, an EC2 instance changes its public IP address every time it is stopped or restarted. An **Elastic IP** gives your instance a permanent static IPv4 address.

1. In the EC2 left sidebar, click **Elastic IPs** (under **Network & Security**).
2. Click **Allocate Elastic IP address**.
3. Choose **Amazon's pool of IPv4 addresses** and click **Allocate**.
4. Select the newly allocated Elastic IP from the list.
5. Click **Actions** -> **Associate Elastic IP address**.
6. Set:
   - **Resource type**: Instance
   - **Instance**: Select your running `cucumbercare-production` instance.
7. Click **Associate**.
8. Note down this IP address (e.g. `54.210.120.45`). This is your application's permanent public address!

---

## 4. Connecting to Your EC2 Instance

Open your local terminal (macOS / Linux / Windows WSL / PowerShell):

```bash
# 1. Protect your private key file permissions (required by SSH)
chmod 400 /path/to/cucumbercare-key.pem

# 2. SSH into your Ubuntu EC2 instance
ssh -i /path/to/cucumbercare-key.pem ubuntu@<YOUR-ELASTIC-IP>
```

*Example:*
```bash
ssh -i ~/.ssh/cucumbercare-key.pem ubuntu@54.210.120.45
```

When prompted: `Are you sure you want to continue connecting (yes/no/[fingerprint])?`, type `yes` and hit Enter. You are now logged into your remote EC2 server!

---

## 5. Server Provisioning & Optimization

Run these commands on your EC2 instance terminal.

### 5.1 Update System Packages
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y git curl wget htop ufw
```

### 5.2 Add 4GB Swap Space (Critical for AI/PyTorch)
Even on `t3.medium` (4GB RAM) or `t3.small` (2GB RAM), compiling frontend assets and loading PyTorch models can trigger brief memory spikes. Adding a 4GB swap file completely eliminates "Out Of Memory" (OOM Killer) crashes:

```bash
# Allocate 4GB swapfile
sudo fallocate -l 4G /swapfile

# Set secure permissions
sudo chmod 600 /swapfile

# Format and activate swap
sudo mkswap /swapfile
sudo swapon /swapfile

# Verify swap is active
free -h

# Make swap permanent across reboots
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab

# Optimize swappiness (prefer RAM, use swap when needed)
sudo sysctl vm.swappiness=10
echo 'vm.swappiness=10' | sudo tee -a /etc/sysctl.conf
```

### 5.3 Install Docker & Docker Compose Plugin
Install the official Docker Engine and Compose plugin on Ubuntu:

```bash
# 1. Remove conflicting packages if present
for pkg in docker.io docker-doc docker-compose podman-docker containerd runc; do sudo apt-get remove -y $pkg; done

# 2. Add Docker's official GPG key
sudo install -m 0755 -d /etc/apt/keyrings
sudo curl -fsSL https://download.docker.com/linux/ubuntu/gpg -o /etc/apt/keyrings/docker.asc
sudo chmod a+r /etc/apt/keyrings/docker.asc

# 3. Add Docker repository to Apt sources
echo \
  "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.asc] https://download.docker.com/linux/ubuntu \
  $(. /etc/os-release && echo "$VERSION_CODENAME") stable" | \
  sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

# 4. Install Docker Engine, CLI, and Docker Compose Plugin
sudo apt update
sudo apt install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

# 5. Enable and start Docker service
sudo systemctl enable docker
sudo systemctl start docker

# 6. Allow the ubuntu user to run docker without 'sudo'
sudo usermod -aG docker ubuntu

# 7. Apply new group membership immediately
newgrp docker
```

Verify Docker works:
```bash
docker --version
docker compose version
```

---

## 6. Deploying Frontend & Backend Application

Choose **Option A** (Recommended), **Option B**, or **Option C**.

### Option A: Deploy via Git (Recommended)

If your code is pushed to a GitHub / GitLab repository:

```bash
cd ~
git clone https://github.com/<your-username>/<your-repo-name>.git cucumber_leaf
cd ~/cucumber_leaf
```

*(If your repository is private, use a GitHub Personal Access Token or add your EC2 SSH key to GitHub).*

---

### Option B: Deploy via SCP / Local Transfer

If you have not pushed to Git, you can copy your project files directly from your local computer to EC2 using `rsync` or `scp`.

**Run this on your local Mac/PC terminal (NOT inside EC2):**

```bash
# Run from your local machine
rsync -avz --exclude 'node_modules' \
           --exclude '.git' \
           --exclude '__pycache__' \
           --exclude '.pytest_cache' \
           --exclude 'archive.zip' \
           --exclude 'dist' \
           -e "ssh -i /path/to/cucumbercare-key.pem" \
           /Users/ananyan/Documents/cucumber_leaf/ \
           ubuntu@<YOUR-ELASTIC-IP>:~/cucumber_leaf/
```

After the transfer finishes, SSH into EC2:
```bash
ssh -i /path/to/cucumbercare-key.pem ubuntu@<YOUR-ELASTIC-IP>
cd ~/cucumber_leaf
```

---

### Option C: Deploy via Pre-built Docker Hub Images

If you prefer building images locally on your workstation and pushing to Docker Hub:

1. **On your local machine**, build and push for AMD64:
```bash
export DOCKERHUB_USER="<your-dockerhub-username>"

docker buildx build --platform linux/amd64 -t ${DOCKERHUB_USER}/cucumbercare-backend:latest -f backend/Dockerfile ./backend --push
docker buildx build --platform linux/amd64 -t ${DOCKERHUB_USER}/cucumbercare-frontend:latest -f frontend/Dockerfile ./frontend --push
```

2. **On the EC2 instance**, create a minimal `docker-compose.yml` pointing to your Docker Hub images:
```bash
mkdir -p ~/cucumber_leaf && cd ~/cucumber_leaf

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

---

## 7. Environment Configuration

Inside `~/cucumber_leaf` on your EC2 instance, create your production `.env` file:

```bash
cd ~/cucumber_leaf
cp .env.example .env
nano .env
```

Set your configuration:
```ini
# Optional API keys for AI agronomic explanations
GEMINI_API_KEY=AIzaSy...your-gemini-key
GROQ_API_KEY=gsk_...your-groq-key

# Server binding
PORT=8000
HOST=0.0.0.0
```

> **Offline Fallback Guarantee**: If you leave `GEMINI_API_KEY` and `GROQ_API_KEY` blank, the app will continue to work perfectly using the built-in botanical pathology knowledge base for all 8 leaf conditions.

Save and exit `nano` by pressing `Ctrl + O`, `Enter`, and then `Ctrl + X`.

---

## 8. Building & Launching the Containers

Inside `~/cucumber_leaf`, run:

```bash
# Build and launch both containers in detached (background) mode
docker compose up -d --build
```

### What happens during this build:
1. **Backend**: Installs Python 3.11, CPU-only PyTorch & Torchvision, and dependencies; pre-configures model caching directory.
2. **Frontend**: Multi-stage build compiles the Vite React 19 SPA, and sets up high-performance Nginx with the `/api/` reverse-proxy rule.
3. **Health Check**: Frontend container waits until the FastAPI backend reports `healthy` before serving traffic.

---

## 9. Verifying the Deployment

### Step 1: Check Container Status
```bash
docker compose ps
```
Both containers should display status `Up` (backend showing `(healthy)`):
```text
NAME                    IMAGE                         COMMAND                  SERVICE    STATUS
cucumbercare-backend    cucumbercare-backend:latest    "uvicorn main:app..."    backend    Up (healthy)
cucumbercare-frontend   cucumbercare-frontend:latest   "/docker-entrypoint…"   frontend   Up
```

### Step 2: Test Backend Health Check from EC2
```bash
curl -f http://localhost/api/health
```
**Expected JSON output:**
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

### Step 3: Open in Browser
Open your web browser on your computer and navigate to:
```text
http://<YOUR-ELASTIC-IP>
```
*Example:* `http://54.210.120.45`

You will see the **CucumberCare AI** landing page! Click **Launch Diagnosis Workspace**, upload or select a cucumber leaf image, and test the disease screening, Kannada audio narration, and PDF report download.

---

## 10. Setting Up Custom Domain & Free SSL (HTTPS)

To secure your production app with `https://yourdomain.com` using a free Let's Encrypt certificate:

### Step 1: Point Your Domain DNS to EC2
Go to your domain registrar (GoDaddy, Namecheap, Cloudflare, Route53, etc.) and add an **A Record**:
- **Host / Name**: `@` (or `subdomain`, e.g. `leaf`)
- **Type**: `A`
- **Value / Target**: `<YOUR-ELASTIC-IP>`
- **TTL**: `300` (or Automatic)

### Step 2: Install Certbot on EC2
On your EC2 instance:
```bash
sudo apt install -y certbot
```

### Step 3: Generate the SSL Certificate
Temporarily stop port 80 to obtain the certificate:
```bash
# 1. Stop frontend container temporarily
docker compose stop frontend

# 2. Request certificate from Let's Encrypt
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com

# 3. Certificates are saved to:
# /etc/letsencrypt/live/yourdomain.com/fullchain.pem
# /etc/letsencrypt/live/yourdomain.com/privkey.pem
```

### Step 4: Configure HTTPS in Nginx
Update `nginx.conf` in your project to listen on port 443 with SSL and redirect port 80 to 443:

```bash
cat << 'EOF' > nginx.conf
server {
    listen 80;
    listen [::]:80;
    server_name yourdomain.com www.yourdomain.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name yourdomain.com www.yourdomain.com;

    ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
    ssl_prefer_server_ciphers on;

    root /usr/share/nginx/html;
    index index.html;

    client_max_body_size 25M;

    # Proxy API requests to backend container
    location /api/ {
        proxy_pass http://backend:8000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 120s;
        proxy_connect_timeout 60s;
        proxy_send_timeout 120s;
    }

    # React SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        expires 30d;
        add_header Cache-Control "public, no-transform";
        try_files $uri =404;
    }
}
EOF
```

Mount the SSL certificates and port 443 in `docker-compose.yml`:
```yaml
  frontend:
    # ...
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - /etc/letsencrypt:/etc/letsencrypt:ro
      - ./nginx.conf:/etc/nginx/conf.d/default.conf:ro
```

Restart containers:
```bash
docker compose up -d
```

### Step 5: Automated SSL Certificate Renewal
Add a root cron job to renew certificates every 60 days:
```bash
sudo crontab -e
```
Add the line:
```cron
0 3 1 * * certbot renew --quiet && cd /home/ubuntu/cucumber_leaf && docker compose restart frontend
```

---

## 11. Production Operations & Maintenance Commands

### Viewing Logs in Real Time
```bash
# Combined real-time logs
docker compose logs -f

# Backend (FastAPI / PyTorch) logs only
docker compose logs -f backend

# Frontend (Nginx access and error) logs only
docker compose logs -f frontend
```

### Restarting the Services
```bash
# Restart both containers
docker compose restart

# Restart only backend
docker compose restart backend
```

### Deploying Code Updates (CI/CD Workflow)
When you have updated your code in Git:
```bash
cd ~/cucumber_leaf
git pull origin main
docker compose up -d --build
```
Docker will re-build only the modified layers (using cached steps for PyTorch/NPM packages), resulting in fast, near-zero-downtime updates!

### Stopping the Services
```bash
# Stop containers (keeps volumes and model cache intact)
docker compose down

# Stop containers AND delete cached models (clean wipe)
docker compose down -v
```

### Server Monitoring & Resource Inspection
```bash
# Check CPU and RAM utilization per container
docker stats --no-stream

# Check disk space usage
df -h

# Clean up old unused Docker build caches
docker system prune -f
```

---

## 12. Troubleshooting & FAQs

### Q1: `Permission denied (publickey)` when trying to SSH into EC2
- **Cause**: The key permissions are too loose or the wrong username was specified.
- **Fix**:
  ```bash
  chmod 400 /path/to/cucumbercare-key.pem
  ssh -i /path/to/cucumbercare-key.pem ubuntu@<ELASTIC-IP>
  ```
  *(Make sure the user is `ubuntu`, not `root` or `ec2-user`).*

### Q2: Browser displays "This site can’t be reached" (Connection timed out)
- **Cause**: Port 80 (HTTP) or 443 (HTTPS) is not open in the EC2 Security Group.
- **Fix**:
  1. Open the AWS EC2 Console -> **Security Groups**.
  2. Select your instance's security group -> **Edit inbound rules**.
  3. Ensure there is a rule for **HTTP** (Port 80) with source `0.0.0.0/0`.
  4. If using Ubuntu UFW firewall on the instance, allow port 80:
     ```bash
     sudo ufw allow 80/tcp
     sudo ufw allow 443/tcp
     sudo ufw allow 22/tcp
     sudo ufw enable
     ```

### Q3: 502 Bad Gateway from Nginx
- **Cause**: The backend container is still downloading the ConvNeXt model weights on first start, or crashed.
- **Fix**:
  Check the backend logs:
  ```bash
  docker compose logs -f backend
  ```
  Wait 30-45 seconds on the very first start for the 99MB Hugging Face model weights to download into the `model_cache` volume. Once the log outputs `Application startup complete`, the 502 error will resolve automatically.

### Q4: Container exits with Code 137 (Killed)
- **Cause**: Out-Of-Memory (OOM) on smaller instance types like `t3.small`.
- **Fix**: Verify your swap space is active by running `free -h`. If swap is `0B`, follow [Section 5.2](#52-add-4gb-swap-space-critical-for-aipytorch) to activate 4GB of swap.

### Q5: Will my model weights re-download if I restart the EC2 instance?
- **Answer**: **No.** The Hugging Face cache is stored in the Docker volume `cucumbercare_model_cache` mapped to `/root/.cache/huggingface`. It persists across container restarts and EC2 reboots.

---

## Summary Checklist for Deployment

- [ ] EC2 instance created (`t3.medium`, Ubuntu 24.04 LTS x86_64, 25GB gp3 storage).
- [ ] Security Group allows Inbound Port 22 (SSH), Port 80 (HTTP), and Port 443 (HTTPS).
- [ ] Elastic IP allocated and associated with the EC2 instance.
- [ ] SSH connected successfully using `cucumbercare-key.pem`.
- [ ] 4GB Swap file created and enabled.
- [ ] Docker and Docker Compose plugin installed.
- [ ] Project files cloned or copied to `~/cucumber_leaf`.
- [ ] `.env` file configured.
- [ ] `docker compose up -d --build` executed.
- [ ] `curl -f http://localhost/api/health` returns status healthy.
- [ ] Web application opened at `http://<ELASTIC-IP>` and verified end-to-end.
