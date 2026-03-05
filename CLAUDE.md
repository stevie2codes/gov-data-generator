# CLAUDE.md

## Project Overview

Government Data Generator — a React/TypeScript app that generates realistic mock data for government and municipal use cases. Includes a REST API server for external consumption.

## Architecture

- **Frontend**: Vite + React 18 + TypeScript + Tailwind CSS + shadcn/ui
- **API Server**: Express on port 3001, serves generated mock data over REST
- **Shared Logic**: Data type definitions in `src/generators/dataTypes.ts`, generation logic in `src/components/DataGenerator.tsx`

## Key Paths

- `src/App.tsx` — main app component
- `src/components/ConfigPanel.tsx` — data type selection and field configuration UI
- `src/components/DataGenerator.tsx` — all mock data generation logic (name pools, location data, generators for 14 data types)
- `src/components/DataPreview.tsx` — data table preview with search, sort, pagination, column operations
- `src/generators/dataTypes.ts` — shared data type configs (imported by both frontend and API server)
- `server/index.ts` — Express server entry point
- `server/routes/datasets.ts` — API route handlers (list, schema, generate)
- `src/styles/globals.css` — Tailwind config and CSS variables (dark "federal terminal" theme)

## Commands

```bash
npm run dev        # Vite frontend (port 3000)
npm run server     # API server only (port 3001)
npm run dev:all    # Both frontend + API
npm run build      # Production build
npm run lint       # ESLint
npm run type-check # TypeScript checking
```

## API Endpoints

- `GET /api/datasets` — list all 14 data types
- `GET /api/datasets/:type/schema` — field definitions for a type
- `GET /api/datasets/:type?count=N&fields=a,b,c` — generate mock data
- `GET /api/health` — health check

## Conventions

- TypeScript strict mode
- Path alias: `@/*` maps to `./src/*`
- ESM project (`"type": "module"` in package.json)
- shadcn/ui components in `src/components/ui/`
- Dark theme with IBM Plex Mono (body) and Bebas Neue (headings)
- Server uses `tsx` to run TypeScript directly (no build step)

## Data Types

14 types across 5 categories: People & Citizens, Operations & Services, Financial & Accounting, Compliance & Licensing, Assets & Inventory. All defined in `src/generators/dataTypes.ts`.

## Design Docs

Plans and design decisions are in `docs/plans/`.
