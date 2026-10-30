# Multi-stage Dockerfile for CucumberCare AI Frontend

# Stage 1: Build React SPA bundle (runs natively on build platform for maximum speed and compatibility)
FROM --platform=$BUILDPLATFORM node:20-slim AS build

WORKDIR /app

# Install dependencies using clean cache strategy
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit || npm install --no-audit

# Copy source code and build production assets
COPY . .
RUN npm run build

# Stage 2: Serve with high-performance Nginx
FROM nginx:alpine

# Remove default Nginx website
RUN rm -rf /usr/share/nginx/html/*

# Copy built static assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy production Nginx reverse proxy configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=15s --timeout=5s --retries=3 \
  CMD wget --spider -q http://127.0.0.1/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
