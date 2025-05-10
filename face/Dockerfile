FROM python:3.9

WORKDIR /face

# Install system dependencies
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies first (for better caching)
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Explicitly ensure models directory is included and permissions are set
RUN ls -la models/ && \
    chmod -R 755 models/

# Debug information on startup
RUN echo "Listing model files:" && ls -la models/

# Expose port
EXPOSE 8000

# Run with increased verbosity for debugging
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--log-level", "debug"]