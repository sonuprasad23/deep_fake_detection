# backend/Dockerfile

# 1. Base Image: Use an official Python runtime
FROM python:3.11-slim

# 2. Set Environment Variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# 3. Set Working Directory
WORKDIR /code

# 4. Install System Dependencies (if needed by Python packages)
# Example: build-essential for compiling, libjpeg for Pillow JPEG support
RUN apt-get update && apt-get install -y --no-install-recommends \
    build-essential \
    libjpeg-dev \
    # Add other system libraries required by your dependencies here
    && rm -rf /var/lib/apt/lists/*

# 5. Install Python Dependencies
# Copy requirements first to leverage Docker cache
COPY requirements.txt .
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt

# 6. Copy Application Code
# Copies main.py, yes_final_model.h5, etc. into /code
COPY . .

# 7. Expose Port (HF Spaces often expects 7860)
EXPOSE 7860

# 8. Run Application
# Command to start the Uvicorn server when the container launches
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "7860"]