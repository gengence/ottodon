#!/bin/bash
set -e

cd "$(dirname "$0")/../web" || exit 1

echo "Installing dependencies in $(pwd)..."

corepack enable

pnpm install

echo "Dependency installation complete." 