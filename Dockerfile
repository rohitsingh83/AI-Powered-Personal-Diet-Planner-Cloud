FROM python:3.11-slim

WORKDIR /app

# Keep Python output unbuffered and clean
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Install dependencies first for Docker caching
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all source files
COPY . .

# Set Python search path to include both app root and backend
ENV PYTHONPATH="/app:/app/backend"

EXPOSE 8000

# Dynamically bind to Render's injected $PORT or fallback to 8000
CMD ["sh", "-c", "uvicorn app:app --host 0.0.0.0 --port ${PORT:-8000}"]
