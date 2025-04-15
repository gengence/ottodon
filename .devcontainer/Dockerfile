FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:latest

RUN npm install -g pnpm

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    curl \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*

RUN usermod -u 1000 node && groupmod -g 1000 node