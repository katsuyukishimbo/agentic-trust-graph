# Agentic Trust Graph

This repository provides a docker-compose based reference implementation for a LangGraph + FastAPI backend paired with a Next.js frontend. The system processes user feedback, structures it into requirements, routes it through a Human-In-The-Loop (HITL) approval step, and (stub) saves it to Notion.

## Getting Started

1. Copy `backend/.env.example` to `backend/.env` and populate credentials if needed.
2. Build and start the stack:
   ```bash
   docker compose up --build
   ```
3. Access the services:
   - Frontend UI: http://localhost:3000
   - Backend API: http://localhost:8000/docs

## Project Structure

```
agentic-trust-graph/
├─ docker-compose.yml
├─ backend/
│  ├─ Dockerfile
│  ├─ requirements.txt
│  ├─ .env.example
│  ├─ app/
│  │  ├─ main.py
│  │  ├─ api/
│  │  │  └─ routes.py
│  │  └─ schemas.py
│  ├─ services/
│  │  └─ hitl_store.py
│  └─ workflow/
│     ├─ graph.py
│     ├─ nodes.py
│     └─ state.py
└─ frontend/
   ├─ Dockerfile
   └─ next-app/
      ├─ package.json
      ├─ tsconfig.json
      ├─ next.config.js
      ├─ app/
      │  ├─ layout.tsx
      │  ├─ page.tsx
      │  └─ globals.css
      └─ next-env.d.ts
```

The backend `save_to_notion` function currently logs a stub. Replace it with a real Notion API call to enable persistence.
