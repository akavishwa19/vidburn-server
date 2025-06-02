# syntax=docker/dockerfile:1

ARG NODE_VERSION=20.18.1

FROM node:${NODE_VERSION}-bullseye

# Environment variables - your specific variables with defaults
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0
ENV DEEP_AI_API_KEY=25049314-2c31-4294-9e36-a953485835e9
ENV UNSPLASH_ACCESS_KEY=TTl5_UphS3i8JIjBOY4mGRUkJcyY_xHMVEgLG2LB894
ENV UNSPLASH_SECRET_KEY=oIeY4FpIwC8JBa9ahJVbvUU2gpgz7W0ve0jBxUCZgeo
ENV PEXELS_API_KEY=bMEvtMUu35HY6UOTzjWqhp6qphXQs0OUDhuofIfMXeKVFuRjF5o106MW

# Install system dependencies including Python, pip, and FFmpeg
RUN apt-get update && apt-get install -y \
    python3 \
    python3-pip \
    python3-venv \
    ffmpeg \
    build-essential \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Create Python virtual environment
RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

# Install Python packages in virtual environment
RUN pip install --no-cache-dir \
    openai-whisper \
    torch \
    torchaudio \
    --extra-index-url https://download.pytorch.org/whl/cpu

WORKDIR /usr/src/app

# Download Node.js dependencies
RUN --mount=type=bind,source=package.json,target=package.json \
    --mount=type=bind,source=package-lock.json,target=package-lock.json \
    --mount=type=cache,target=/root/.npm \
    npm ci

# Copy the rest of the source files into the image
COPY . .

# Create uploads directory and fix permissions
RUN mkdir -p /usr/src/app/uploads && \
    chown -R node:node /usr/src/app && \
    chmod -R 755 /usr/src/app

# Run the application as a non-root user
USER node

# Expose the port that the application listens on
EXPOSE 3000

# Run the application
CMD ["node", "app.js"]