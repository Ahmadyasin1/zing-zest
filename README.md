# Zing & Zest Street Bites — AI Marketing Intelligence Platform

**Ultra-modern Next.js platform** for Assignment 4 (AIUE3013 · Spring 2026 · UCP).

**Tagline:** Fresh. Fast. Full of Flavor.

---

## Quick Start

### Windows (easiest)
1. Install **Node.js 18+** from [nodejs.org](https://nodejs.org/)
2. Double-click **`START.bat`**
3. Browser opens at **http://localhost:3000**

### Manual
```bash
npm install
cp .env.example .env.local   # add HF_TOKEN
npm run dev
```

---

## AI Setup (Hugging Face — free tier)

1. Create account at [huggingface.co](https://huggingface.co)
2. Generate token: [huggingface.co/settings/tokens](https://huggingface.co/settings/tokens)
3. Add to `.env.local`:
```env
HF_TOKEN=hf_your_token_here
```

**Without token:** Platform works fully with offline fallbacks for chat, search, summaries, and vision. Image generation requires HF_TOKEN.

### Models used (with automatic fallbacks)
| Feature | Primary Model |
|---------|---------------|
| Chat / Copilot | `meta-llama/Llama-3.2-3B-Instruct` |
| Image Generation | `stabilityai/stable-diffusion-xl-base-1.0` |
| Vision / Caption / VQA | `google/paligemma2-3b-pt-224` |
| Object Detection | `facebook/detr-resnet-50` |
| Semantic Search | `sentence-transformers/all-MiniLM-L6-v2` |

---

## Tech Stack

- **Next.js 15** App Router · **React 19** · **TypeScript**
- **Tailwind CSS 4** · **Framer Motion**
- **Chart.js** · **Hugging Face Inference API**
- Server-side API routes — tokens never exposed to client

---

## Features

### All Assignment 4 Deliverables (preserved)
- Executive Report (2,847 words)
- AI Prompts & Interaction Gallery
- Customer Personas (3 profiles + radar charts)
- Forecasting Models (daily/weekly/monthly + scenarios)
- Competitor Analysis Dashboard
- Customer Journey Map (6 stages)
- Recovery Strategy (3 phases + RCA)

### New AI Lab (`AI Lab` in sidebar) — 9+ Features
| Feature | Description |
|---------|-------------|
| **ZestAI Copilot** | Floating chat with quick prompts — site guidance & Q&A |
| **Text-to-Image** | SDXL marketing visual generator |
| **Computer Vision** | Upload → caption, VQA, OCR + DETR detection |
| **Semantic Search & RAG** | Search all report/content |
| **Auto-Summary & KPI Explainers** | One-click executive insights |
| **Campaign Copy Generator** | Instagram, WhatsApp, TikTok, Email ads |
| **Pitch Generator** | Investor, professor, or customer pitches |
| **Sentiment Analyzer** | Analyze customer reviews with action tips |
| **Persona Matcher** | Interactive quiz → matched customer persona |
| **Presentation Mode** | 8-slide fullscreen deck (top bar → Present) |
| **AI Status Dashboard** | Live feature status on overview page |

### Premium UX
- Cinematic splash screen on load
- Glassmorphism · animated gradients · floating logo
- AI feature marquee on overview
- Tabbed AI Lab (Overview · Create · Analyze · Engage)
- Framer Motion page transitions
- Dark/light mode · mobile-first responsive
- Loading, error, retry, rate-limit states

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run start` | Production server |
| `npm run lint` | ESLint |
| `npm run test:smoke` | Smoke tests (server must be running) |
| `npm run test:ai` | AI feature tests |

---

## Deployment

### Option 1 — Windows (local / VPS)
Double-click **`DEPLOY.bat`** → builds and starts production server on port 3000.

### Option 2 — Share deploy package
Run **`CREATE-DEPLOY-ZIP.bat`** → creates `Zing_Zest_Deploy_Ready.zip` (no `node_modules`, no secrets).

### Option 3 — Docker
```bash
# Copy .env.example to .env.local and set HF_TOKEN first
docker compose up -d --build
```
Open **http://localhost:3000**

### Option 4 — Vercel (recommended cloud)
1. Push project to GitHub
2. Import at [vercel.com/new](https://vercel.com/new)
3. Add environment variable: `HF_TOKEN` = your Hugging Face token
4. Deploy

Or CLI: `npx vercel --prod`

### Option 5 — Linux / macOS
```bash
chmod +x deploy.sh
./deploy.sh          # build + start
./deploy.sh build-only   # build only
```

**Required env for live AI:** `HF_TOKEN` in `.env.local` (local/Docker) or Vercel/Railway dashboard (cloud).

---

## Project Structure

```
src/
├── app/                 # Next.js pages + API routes
│   └── api/ai/          # Hugging Face proxy (chat, image, vision, detect, search, summarize, explain)
├── components/
│   ├── ai/              # Copilot, ImageGen, Vision, Search, Insights
│   ├── charts/          # All 25 Chart.js visualizations
│   ├── layout/          # Shell, sidebar, topbar
│   └── platform/        # All content sections
└── lib/
    ├── data/            # ZZ data + report + personas (from original project)
    └── ai/              # HF client, RAG corpus, API utils
legacy/                  # Original vanilla HTML/CSS/JS version
public/                  # Logo assets
```

---

## Team

**Main Developer:** Ahmad Yasin (L1F22BSAI0052)

| Name | Registration No. | Role |
|------|------------------|------|
| Ahmad Yasin | L1F22BSAI0052 | Main Developer |
| Abdul Rehman | L1F22BSAI0031 | Team Member |
| Eman Sarfraz | L1F22BSAI0034 | Team Member |
| Nouman Zakar | L1F22BSAI0048 | Team Member |
| Ali Hassan | L1F22BSAI0059 | Team Member |

This is a collaborative UCP team project. Ahmad Yasin designed and developed the platform; all five members contributed to research, strategy, and deliverables.

**Instructor:** Dr. Shahjahan Masud · **Course:** AIUE3013 · **Term:** Spring 2026

---

© 2026 · University of Central Punjab · Fundamentals of Marketing
