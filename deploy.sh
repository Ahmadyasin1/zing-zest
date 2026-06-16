#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT"

echo ""
echo "========================================================"
echo " Zing & Zest Street Bites — Production Deployment"
echo " Main Developer: Ahmad Yasin"
echo "========================================================"
echo ""

if ! command -v node >/dev/null 2>&1; then
  echo "ERROR: Node.js 18+ is required."
  exit 1
fi

NODE_MAJOR="$(node -p "process.versions.node.split('.')[0]")"
if [ "$NODE_MAJOR" -lt 18 ]; then
  echo "ERROR: Node.js 18+ required. Found: $(node -v)"
  exit 1
fi

if [ ! -f .env.local ] && [ -f .env.example ]; then
  cp .env.example .env.local
  echo "Created .env.local — set HF_TOKEN for live AI."
fi

echo "[1/4] Installing dependencies..."
npm ci

echo "[2/4] Building..."
npm run build

MODE="${1:-start}"
if [ "$MODE" = "build-only" ]; then
  echo ""
  echo "Build complete."
  echo "  npm run start          — run locally"
  echo "  docker compose up -d   — run with Docker"
  echo "  npx vercel --prod      — deploy to Vercel"
  exit 0
fi

echo "[3/4] Starting production server on http://0.0.0.0:3000"
export NODE_ENV=production
export PORT="${PORT:-3000}"
exec npm run start
