# ALPHA AI

**Version:** 1.0.0 (Phase 1 — Frontend Workspace)  
**Project Owner:** Arpan Goswami  
**License:** MIT (see `LICENSE`)

ALPHA AI is a personal AI assistant and knowledge management platform built around privacy, data ownership, and modular flexibility.

---

## Phase 1 Scope & Honest Status

This repository currently implements **Phase 1: Complete Frontend Workspace**.

- **Included in Phase 1:**
  - Responsive light-first workspace UI with left sidebar navigation and mobile drawer.
  - Eight interactive sections: **Dashboard**, **AI Chat**, **Knowledge Center**, **Personal Memory**, **File Manager**, **Agent Tools**, **History**, and **Settings**.
  - Browser-local `localStorage` persistence for demonstration conversations, user-added demo memories, browser file previews, tool preference flags, and appearance/backend settings.
  - Client-side file reading for previewing local `.txt`, `.md`, `.json`, `.csv`, and image/PDF metadata without uploading to any server.
  - Exportable JSON snapshot of browser-local workspace data.

- **Explicitly Out of Scope in Phase 1 (Planned for Phases 2–5):**
  - Real AI model inference (local or cloud).
  - Python / FastAPI backend persistence and SQLite storage.
  - Document chunking, embeddings, or Retrieval-Augmented Generation (RAG).
  - Live operating system or external agent tool execution.

No API keys, passwords, or backend secrets are required or embedded in this frontend.

---

## Tech Stack

- **Framework:** React 19 + TypeScript
- **Build Tool:** Vite
- **Styling:** Tailwind CSS v4
- **Animation:** Framer Motion (`motion/react`)
- **Icons:** Lucide React

---

## Project Structure

```text
src/
├── assets/          # Local static images and media
├── components/      # Reusable UI primitives and modals
├── context/         # Shared workspace React Context
├── data/            # Initial demonstration datasets
├── hooks/           # Custom React hooks
├── layouts/         # Sidebar & responsive workspace shell
├── pages/           # Lazy-loaded section views (8 pages)
├── services/        # Frontend data & future backend abstraction layer
├── types/           # TypeScript domain interfaces
└── utils/           # localStorage, formatting, and date helpers
```

---

## Getting Started

### Prerequisites

- Node.js `>= 20.x`
- npm `>= 10.x`

### Installation

```bash
npm install
```

### Development Server

```bash
npm run dev
```

The development server runs at `http://localhost:3000`.

### Type Check & Production Build

```bash
npm run lint
npm run build
```

Production static assets are emitted to `dist/`.

---

## Static Deployment (GitHub Pages)

Because Phase 1 is a pure client-side React + Vite application, the `dist/` output can be hosted directly on **GitHub Pages** or any static host:

1. If deploying to a project subpath (`https://<username>.github.io/<repo>/`), set `base: '/<repo>/'` in `vite.config.ts`.
2. Run `npm run build` and publish the `dist/` directory.
3. When the Phase 2 backend is introduced, configure its endpoint URL in **Settings → Model & Backend Preferences** without rewriting the frontend components.
