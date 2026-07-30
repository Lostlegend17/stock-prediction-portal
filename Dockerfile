# --- Stage 1: Build the React Application ---
FROM node:20-slim AS frontend-builder
WORKDIR /app/frontend-react
COPY frontend-react/package*.json ./
RUN npm install
COPY frontend-react/ ./
RUN npm run build

# --- Stage 2: Bundle Everything Into Python ---
FROM python:3.11-slim
ENV PYTHONUNBUFFERED=1
ENV TF_CPP_MIN_LOG_LEVEL=2

WORKDIR /app

# Install base engine build parameters
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY backend-drf/requirement.txt ./backend-drf/
RUN pip install --no-cache-dir --src /tmp/pip-src --no-compile -r backend-drf/requirement.txt

# Copy backend app source code
COPY backend-drf/ ./backend-drf/

# 🎯 HYPHEN CORRECTION: Move Stage 1's compiled files out of the hyphenated directory
RUN mkdir -p /app/backend-drf/frontend_react_dist
COPY --from=frontend-builder /app/frontend-react/dist/ /app/backend-drf/frontend_react_dist/

# Step inside the backend directory to compile assets
WORKDIR /app/backend-drf
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Execute server engine pipeline
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "stock_prediction_main.wsgi:application"]
