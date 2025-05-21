FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

RUN apt-get update && \
    apt-get install -y \
        libreoffice \
        ffmpeg \
        ghostscript \
        python3 \
        python3-pip \
        python3-venv && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/pdf2docx_venv

RUN /opt/pdf2docx_venv/bin/pip install --no-cache-dir pdf2docx

ENV PATH="/opt/pdf2docx_venv/bin:$PATH"

RUN mkdir -p /pnpm-store && chown vscode:vscode /pnpm-store