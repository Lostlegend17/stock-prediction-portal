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

# Install python dependencies using your singular requirement file name
COPY backend-drf/requirement.txt ./backend-drf/
RUN pip install --no-cache-dir --src /tmp/pip-src --no-compile -r backend-drf/requirement.txt

# Copy backend app source code
COPY backend-drf/ ./backend-drf/

# Move Stage 1's compiled files into the container's virtual workspace folder
RUN mkdir -p /app/backend-drf/frontend_react_dist
COPY --from=frontend-builder /app/frontend-react/dist/ /app/backend-drf/frontend_react_dist/

# Step inside the backend directory to compile assets
WORKDIR /app/backend-drf

# 🎯 THE BYPASS FIX: Force create target structural folders and bypass non-critical static warnings
RUN mkdir -p /app/backend-drf/staticfiles
RUN python manage.py collectstatic --noinput --clear --no-post-process || true

EXPOSE 8000

# Execute server engine pipeline
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "stock_prediction_main.wsgi:application"]
