# Production Dockerfile for CucumberCare AI Backend
# Python 3.11 with CPU-only PyTorch and Hugging Face ConvNeXt support

FROM python:3.11-slim

ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PIP_NO_CACHE_DIR=1 \
    HF_HOME=/root/.cache/huggingface \
    PORT=8000 \
    HOST=0.0.0.0

WORKDIR /app

# Install minimal OS dependencies for PyTorch, PIL, and health checking
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    gcc \
    libgl1 \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Upgrade pip and pre-install CPU-only PyTorch & Torchvision
RUN pip install --upgrade pip && \
    pip install torch torchvision --index-url https://download.pytorch.org/whl/cpu

# Copy requirements and install remaining backend dependencies
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy backend application source code
COPY . .

# Expose internal port (proxy served via frontend Nginx container)
EXPOSE 8000

# Health check using FastAPI /api/health endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=45s --retries=3 \
  CMD curl -f http://localhost:8000/api/health || exit 1

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
