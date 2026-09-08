# Minimal backend Dockerfile — Render-compatible
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
RUN pip install --no-cache-dir uvicorn[standard]
COPY . .
ENV PYTHONUNBUFFERED=1
EXPOSE 10000
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "10000"]
