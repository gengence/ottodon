FROM mcr.microsoft.com/vscode/devcontainers/javascript-node:20

RUN corepack enable && corepack prepare pnpm@latest --activate

RUN apt-get update && export DEBIAN_FRONTEND=noninteractive \
    && apt-get -y install --no-install-recommends \
    git \
    && apt-get clean -y \
    && rm -rf /var/lib/apt/lists/*