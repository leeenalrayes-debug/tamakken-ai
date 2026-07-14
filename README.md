# AI Interview Coach

An AI-powered web application that generates tailored interview questions,
ideal answers, and coaching tips, built on Next.js 15 (App Router) and a
Meta Llama model served through an OpenAI-compatible API (e.g. Groq).

> **Status:** Feature-complete and production-ready. The full flow works
> end to end: the form submits to `POST /api/interview`, which calls the
> Llama API, validates its JSON output, and returns structured results
> rendered in the UI.

---

## Tech Stack

| Concern            | Choice                              |
| ------------------ | ------------------------------------ |
| Framework           | Next.js 15 (App Router)             |
| UI library          | React 19                            |
| Language            | TypeScript                          |
| Styling             | Tailwind CSS                        |
| Component library   | shadcn/ui (Radix primitives)        |
| Animation           | Framer Motion                       |
| Forms               | React Hook Form                     |
| Validation          | Zod                                 |
| AI provider         | Meta Llama models via an OpenAI-compatible API (e.g. Groq) |
| Hosting             | Vercel                              |
| Database            | None — no persistence layer         |

---

## Folder Structure

```
ai-interview-coach/
├── app/                        # Next.js App Router
│   ├── api/
│   │   └── interview/
│   │       └── route.ts        # POST /api/interview
│   ├── layout.tsx              # Root layout, loads global styles
│   ├── page.tsx                # Home page — composes the full UI
│   ├── loading.tsx             # Route-level loading UI
│   └── error.tsx                # Route-level error boundary
│
├── components/                 # UI components
│   ├── ui/                     # shadcn/ui primitives (Button, Input, Select, Accordion, Card, Label, Textarea)
│   ├── Hero.tsx
│   ├── InterviewForm.tsx
│   ├── QuestionAccordion.tsx
│   ├── LoadingState.tsx
│   ├── ErrorAlert.tsx
│   └── Footer.tsx
│
├── services/
│   └── llama.ts                # Server-only Llama API client (retry, timeout, JSON validation)
│
├── hooks/
│   └── useInterview.ts         # Client-side interview generation lifecycle (calls POST /api/interview)
│
├── lib/
│   ├── utils.ts                # cn() class-merging helper (shadcn requirement)
│   └── validation.ts           # Zod request/response schemas + input sanitization
│
├── types/
│   ├── interview.ts            # Generate Interview API contract (single source of truth)
│   └── common.ts                # Shared cross-cutting types (AsyncStatus, ApiResult<T>)
│
├── utils/
│   └── promptBuilder.ts        # Builds the Llama prompt from validated input
│
├── public/                     # Static assets
├── styles/
│   └── globals.css             # Tailwind directives + shadcn CSS variables
│
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.js
├── components.json             # shadcn/ui configuration
├── eslint.config.mjs
├── .prettierrc.json
├── .env.example
└── .gitignore
```

### Why this layout

- **`app/`** holds only routing, layouts, and route handlers — no business
  logic lives here. `app/api/interview/route.ts` is the single server-side
  entry point that validates input and calls `services/llama.ts`.
- **`components/`** is presentation-only. `components/ui` holds the
  shadcn/ui-style primitives; feature components (`Hero`, `InterviewForm`,
  etc.) sit alongside it and never talk to the network directly.
- **`services/`** isolates all outbound network calls to third parties
  (the Llama API) behind a small server-only module, so the API key is
  never bundled to the client.
- **`hooks/`** contains client-side React hooks that orchestrate state and
  talk to the API route — never directly to `services/llama.ts`.
- **`lib/`** contains cross-cutting, framework-adjacent utilities: the
  shadcn `cn()` helper and the Zod validation schemas used by the API route.
- **`types/`** is the single source of truth for the request/response
  contract, imported by both client (`InterviewForm`, `useInterview`) and
  server (`lib/validation.ts`, `services/llama.ts`) code — so the two
  sides can never silently drift apart.
- **`utils/`** contains pure, side-effect-free helper functions (prompt
  construction) that are easy to unit test in isolation.
- **No database.** All application state is either ephemeral (in the
  request/response cycle) or held client-side; nothing is persisted.

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Then fill in `LLAMA_API_KEY` with a valid API key for your chosen
OpenAI-compatible Llama provider (see `.env.example` for a Groq example).
**Never** commit `.env.local` or expose this key with a `NEXT_PUBLIC_` prefix.

### 3. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000).

### 4. Add more shadcn/ui components as needed

```bash
npx shadcn@latest add dialog toast separator tooltip
```

---

## Available Scripts

| Script                  | Description                          |
| ------------------------ | ------------------------------------- |
| `npm run dev`            | Start the Next.js dev server          |
| `npm run build`          | Production build                      |
| `npm run start`          | Start the production server           |
| `npm run lint`           | Run ESLint                            |
| `npm run lint:fix`       | Run ESLint with auto-fix              |
| `npm run type-check`     | Run the TypeScript compiler (no emit) |
| `npm run format`         | Format the codebase with Prettier     |
| `npm run format:check`   | Check formatting without writing      |

---

## API

### `POST /api/interview`

**Request body:**

```json
{
  "jobTitle": "Software Engineer",
  "experienceLevel": "Senior",
  "jobDescription": "Optional — free text"
}
```

`experienceLevel` must be one of: `Entry Level`, `Junior`, `Mid-Level`,
`Senior`, `Lead`, `Manager`.

**Success response (`200`):**

```json
{
  "summary": "A short interview introduction.",
  "questions": [
    { "question": "...", "idealAnswer": "...", "tip": "..." }
  ]
}
```

`questions` always contains exactly five items.

**Error responses:** `400` (validation), `405` (wrong HTTP method), `500`
(server misconfiguration or unexpected error), `502` (upstream Llama API
error or invalid response after one automatic retry), `504` (upstream
timeout). All error responses have the shape `{ "error": string }`.

---

## Deployment

This project is designed to deploy on [Vercel](https://vercel.com) with
zero additional configuration beyond setting the environment variables
from `.env.example` in the Vercel project settings.
