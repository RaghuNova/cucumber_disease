# CucumberCare AI — Botanical Science & Precision Leaf Pathology

> **A premium agricultural technology platform combining computer vision (PyTorch ConvNeXt) and agronomic language intelligence (Google Gemini) for early cucumber leaf disease screening.**

[![Model: ixrbhii/cucumber-disease-convnext](https://img.shields.io/badge/Model-ConvNeXt--Small-268748?style=flat-square&logo=huggingface)](https://huggingface.co/ixrbhii/cucumber-disease-convnext)
[![Backend: FastAPI](https://img.shields.io/badge/Backend-FastAPI-0B160E?style=flat-square&logo=fastapi)](https://fastapi.tiangolo.com)
[![Frontend: React 19 + Vite](https://img.shields.io/badge/Frontend-React_19_+_Vite-1A3523?style=flat-square&logo=react)](https://vitejs.dev)
[![Language AI: Gemini 3.6](https://img.shields.io/badge/Agronomic_AI-Gemini_3.6_Flash-34A85C?style=flat-square&logo=google)](https://ai.google.dev)
[![License: Apache 2.0](https://img.shields.io/badge/License-Apache_2.0-blue?style=flat-square)](LICENSE)

---

## 1. System Overview & Creative Direction

CucumberCare AI is built from the ground up to reflect a **botanical-science aesthetic**:
- **Palette**: Deep forest green (`#071009`, `#0B160E`), botanical leaf accents (`#268748`, `#34A85C`), cucumber-pulp tints (`#E9F5EC`), and warm ivory (`#FAF8F4`).
- **Typography**: Editorial serif headings paired with clean, accessible sans-serif interface text.
- **Two Distinct Experiences**:
  1. **Interactive Educational Landing Page**: Immersive Hero with macro leaf visual, 4-zone foliar anatomy explorer, photosynthetic physiological storytelling, 8 disease cards with modal inspectors, 3-step AI pipeline walkthrough, differential symptom comparison, and photo acquisition guide.
  2. **Dedicated Diagnosis Workspace (Disease-First Workflow)**:
     - **Leaf Health Assessment**: Prominent primary classification displaying the model's actual predicted condition, real confidence score, and top-3 distribution.
     - **Section A: Primary Disease or Health Classification**: Direct model output with condition-specific clinical overview, visible symptoms, differential diagnosis, numbered immediate field actions, prevention checklist, when to consult an expert, and treatment cautions.
     - **Section B: Nutritional & Physiological Assessment**: Separate evaluation of mobile (N, K, Mg) and immobile (Fe) nutrient chlorosis, root-zone pH lockout, and soil/petiole testing recommendations.
     - **Low-Confidence Honest Reporting**: If confidence is limited (e.g. 41.1%), the model's actual top prediction is displayed without alteration alongside alternative candidates and a clear advisory note.
     - **Spoken Kannada Narration & PDF Export**: Native audio playback and ReportLab PDF diagnostic reports matching the structured on-screen assessment.

---

## 2. Technical Architecture

```mermaid
graph TD
    User([Grower / Agronomist]) -->|Uploads Leaf Photo| Frontend[React 19 + Vite + Tailwind CSS]
    
    subgraph Frontend Client
        Landing[Interactive Botanical Landing Page]
        Workspace[Diagnosis Workspace]
        Presets[Verified Sample Test Presets]
    end

    Frontend -->|POST /api/predict| FastAPI[FastAPI Backend :8000]

    subgraph Backend Services
        Classifier[PyTorch timm ConvNeXt\nhf-hub:ixrbhii/cucumber-disease-convnext]
        Advisor[Agronomic Advisor Engine\nMulti-tier Fallback]
        TTS[Kannada Audio Generator\ntranslate_tts kn]
        PDF[ReportLab PDF Compiler]
    end

    FastAPI --> Classifier
    Classifier -->|Top-3 Probabilities & Class| Advisor
    
    subgraph Language Engine Fallback
        Advisor -->|Primary 3.5s timeout| Gemini[Google Gemini 3.6 Flash]
        Gemini -.->|503/429/Timeout Fallback| Groq[Groq Llama 3.3 70B]
        Groq -.->|Fallback| StaticKB[Static Botanical Database\nAll 8 Conditions]
    end

    FastAPI -->|Stream MP3| TTS
    FastAPI -->|Download PDF| PDF
```

---

## 3. Machine Learning Specification

- **Hugging Face Model ID**: [`ixrbhii/cucumber-disease-convnext`](https://huggingface.co/ixrbhii/cucumber-disease-convnext)
- **Backbone Architecture**: `convnext_small` via `timm` (PyTorch)
- **Input Resolution**: `224 × 224` pixels, RGB
- **Normalization**: ImageNet standard (`mean = [0.485, 0.456, 0.406]`, `std = [0.229, 0.224, 0.225]`)
- **Supported Classes (8 Categories)**:
  1. **Downy Mildew** (*Pseudoperonospora cubensis*) — **Primary Focus**
  2. **Powdery Mildew** (*Podosphaera xanthii*) — **Primary Focus**
  3. **Healthy Leaves** (*Cucumis sativus*) — **Primary Baseline**
  4. **Angular Leaf Spot** (*Pseudomonas syringae pv. lachrymans*)
  5. **Anthracnose** (*Colletotrichum orbiculare*)
  6. **Bacterial Wilt** (*Erwinia tracheiphila*)
  7. **Gummy Stem Blight** (*Stagonosporopsis cucurbitacearum*)
  8. **Nutrient Deficiency** (*Abiotic physiological chlorosis*)

---

## 4. Agronomic Advisory Engine

To guarantee resilience in the field, agronomic recommendations use a **three-tier fallback system**:
1. **Tier 1 (Primary)**: Google Gemini (`gemini-3.6-flash` via the official Interactions API) providing clear 2-sentence disease assessments and 3 targeted action steps.
2. **Tier 2 (Fallback)**: Groq Cloud API (`llama-3.3-70b-versatile`) if configured and Gemini experiences rate limits.
3. **Tier 3 (Guaranteed Offline)**: Expert botanical pathology database hardcoded for all eight cucumber conditions. If network APIs are unreachable, diagnosis and treatment plans return in **< 50 milliseconds**.
4. **Kannada Audio Guidance**: Real-time spoken Kannada audio translation streamed via `/api/speak` for rural agricultural extension workers and growers.
5. **Downloadable PDF Reports**: Full pathology reports generated on demand with ReportLab containing specimen metadata, probability distributions, symptoms, immediate actions, and legal notices.

---

## 5. Prerequisites

- **Python**: Version 3.10 or higher (Python 3.11 / 3.12 / 3.13 tested)
- **Node.js**: Version 18.0.0 or higher
- **npm**: Version 9.0.0 or higher

---

## 6. Step-by-Step Installation & Local Startup

### Step 1: Clone or Navigate to the Repository

```bash
cd /Users/ananyan/Documents/cucumber_leaf
```

### Step 2: Configure Environment Variables

Create or verify the `.env` file in the project root:

```bash
# .env
GEMINI_API_KEY=AIzaSyDq0gDAF_1BHyDNQ0GevdJO64CKRm8wnF0
GROQ_API_KEY=
PORT=8000
HOST=0.0.0.0
```

> **Security Note:** The `.env` file is included in `.gitignore` and is never bundled or exposed to the client browser.

### Step 3: Install Backend Dependencies

From the project root (`cucumber_leaf/`):
```bash
pip install -r backend/requirements.txt
```

*Or, if your terminal is already inside the `backend/` directory:*
```bash
pip install -r requirements.txt
```

*(Key packages: `fastapi`, `uvicorn`, `torch`, `torchvision`, `timm`, `pillow`, `reportlab`, `google-genai`, `requests`)*

### Step 4: Run Backend Automated Tests

From the project root (`cucumber_leaf/`):
```bash
PYTHONPATH=backend python -m pytest backend/test_backend.py -v
```

*Or, from inside the `backend/` directory:*
```bash
python -m pytest test_backend.py -v
```

*(Note: Use `python` or `python3` depending on which alias is bound to your active Conda environment)*

Expected output:
```
======================== 5 passed in 10.75s ========================
```

### Step 5: Start the FastAPI Backend Server

From the project root:
```bash
PYTHONPATH=backend python backend/main.py
```

*Or from inside `backend/`:*
```bash
python main.py
```

The API will be live on: `http://localhost:8000`
- API documentation: `http://localhost:8000/docs`
- Health check: `http://localhost:8000/api/health`

### Step 6: Install Frontend Dependencies & Start Vite

In a new terminal window:

```bash
cd frontend
npm install
npm run dev
```

The web application will open on: **`http://localhost:5173`**

---

## 7. How to Use the Application

1. **Explore the Landing Page**:
   - **Hero Hotspots**: Click the numbers `1`, `2`, `3` on the hero leaf to preview illustrative symptom zones.
   - **Get to Know Your Leaf**: In Section B, click any of the 4 leaf hotspots (`Angular Chlorotic Spots`, `White Powdery Colony`, `Vascular Vein Margins`, `Marginal Scorching`) to view differential observation notes.
   - **8 Detectable Categories**: Click **"Explore Details"** on any card to view detailed symptoms, contributing microclimates, and prevention protocols.
   - **Symptom Matcher**: Select what you are observing in the field (yellowing, powdery patches, wilting) to see differential explanations.
   - **Photo Quality Guide**: Review best practices (diffused daylight, sharp focus, clean background) before taking a picture.

2. **Run a Disease Screening**:
   - Click **"Analyze a Leaf"** in the navigation bar or any CTA to open the **Diagnosis Workspace**.
   - Either drag and drop your cucumber leaf photo (JPEG/PNG/WEBP, max 15MB) or click one of the **Instant Evaluation Presets** (*Healthy Leaf*, *Downy Mildew*, or *Powdery Mildew*).
   - Click **"Run Deep Classification"**.
   - Watch the animated botanical scanner while the ConvNeXt model evaluates the tensor.
   - Review your results:
     - Predicted Condition & Scientific Name
     - Model Confidence % & Level (High, Moderate, Low)
     - Top-3 Candidate Probability Bar Chart
     - Gemini Agronomic Field Actions & Symptoms
     - Click **"🔊 Listen in Kannada / ಕನ್ನಡದಲ್ಲಿ ಕೇಳಿ"** to hear spoken voice guidance.
     - Click **"Download Official PDF Report"** to export an executive diagnostic document.

---

## 8. AWS EC2 Production Deployment Guide

To deploy both frontend and backend on a single AWS EC2 CPU instance:

### Step 1: Provision EC2 Instance
- **Instance Type**: `t3.medium` or `t3.large` (minimum 4 GB RAM recommended for PyTorch CPU inference).
- **OS**: Ubuntu 22.04 LTS or 24.04 LTS.
- **Security Group**: Open Port 22 (SSH), Port 80 (HTTP), and Port 443 (HTTPS).

### Step 2: System Setup on EC2

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y python3-pip python3-venv nginx git nodejs npm
```

### Step 3: Clone Code & Configure Python Environment

```bash
git clone <YOUR_REPOSITORY_URL> /var/www/cucumbercare
cd /var/www/cucumbercare

python3 -m venv venv
source venv/bin/activate
pip install -r backend/requirements.txt
```

### Step 4: Build the Vite Frontend Production Bundle

```bash
cd /var/www/cucumbercare/frontend
npm install
npm run build
```

This generates production-optimized static files in `/var/www/cucumbercare/frontend/dist`.

### Step 5: Configure systemd for the FastAPI Backend

Create `/etc/systemd/system/cucumbercare-backend.service`:

```ini
[Unit]
Description=CucumberCare AI FastAPI Daemon
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/var/www/cucumbercare
EnvironmentFile=/var/www/cucumbercare/.env
ExecStart=/var/www/cucumbercare/venv/bin/uvicorn main:app --app-dir backend --host 127.0.0.1 --port 8000 --workers 2
Restart=always
RestartSec=5

[Install]
WantedBy=multi-user.target
```

Enable and start the service:

```bash
sudo systemctl daemon-reload
sudo systemctl enable cucumbercare-backend
sudo systemctl start cucumbercare-backend
sudo systemctl status cucumbercare-backend
```

### Step 6: Configure Nginx as Reverse Proxy & Static Host

Create `/etc/nginx/sites-available/cucumbercare`:

```nginx
server {
    listen 80;
    server_name your-ec2-ip-or-domain.com;

    # Serve compiled Vite frontend
    root /var/www/cucumbercare/frontend/dist;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy API calls to FastAPI backend
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 60s;
        client_max_body_size 20M;
    }
}
```

Enable site and restart Nginx:

```bash
sudo ln -s /etc/nginx/sites-available/cucumbercare /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 9. Verification & Testing Checklist

| Test Item | Verification Method | Status |
|---|---|---|
| **ConvNeXt Model Loading** | `timm.create_model('hf-hub:ixrbhii/cucumber-disease-convnext')` | Passed (8 classes verified) |
| **Backend Endpoints** | `pytest backend/test_backend.py` (5 tests) | Passed (100%) |
| **Live Prediction** | `curl -X POST -F "file=..." /api/predict` | Passed (JSON with top-3 & advice) |
| **Gemini Interactions API** | `google-genai` with `gemini-3.6-flash` | Passed (with 3.5s resilient timeout) |
| **Kannada TTS Audio** | `/api/speak?text=...` MP3 stream | Passed (HTTP 200, audio/mpeg) |
| **PDF Diagnostic Report** | `/api/report` | Passed (ReportLab PDF compiled) |
| **Frontend Production Build** | `npm run build` | Passed (0 errors, 928ms) |
| **Responsive Design** | 390px mobile, 768px tablet, 1440px desktop | Verified |
| **Keyboard Accessibility** | Hotspots, modal inspectors, tab navigation | Verified (focus rings & Esc key) |
| **API Key Security** | No keys in client bundle (`.gitignore` enabled) | Verified |

---

## 10. Responsible AI & Legal Disclaimer

> **Notice:** CucumberCare AI is an automated decision-support tool designed for agricultural education and preliminary triage. Soil fertility disorders, root nematode damage, and viral vectors can cause foliage symptoms that closely mimic fungal or bacterial diseases. 
> 
> Always corroborate AI screening outputs with on-site inspection, whole-vine examination, and local agricultural extension specialists before applying chemical, hormonal, or systemic crop treatments.
