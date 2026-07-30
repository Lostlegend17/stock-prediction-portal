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

# Install python dependencies with strict low-memory optimization flags
COPY backend-drf/requirements.txt ./backend-drf/
RUN pip install --no-cache-dir --src /tmp/pip-src --no-compile -r backend-drf/requirements.txt

# Copy backend app source code
COPY backend-drf/ ./backend-drf/

# Pull down compiled React build assets from Stage 1 into the container setup
COPY --from=frontend-builder /app/frontend-react/dist ./frontend-react/dist

# Step inside the backend directory to compile assets and migrations
WORKDIR /app/backend-drf
RUN python manage.py collectstatic --noinput

EXPOSE 8000

# Execute server engine pipeline
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "stock_prediction_main.wsgi:application"]
