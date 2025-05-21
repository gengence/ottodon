FROM mcr.microsoft.com/devcontainers/base:ubuntu-24.04

RUN apt-get update && apt-get install -y libreoffice ffmpeg

RUN mkdir -p /pnpm-store && chown vscode:vscode /pnpm-store