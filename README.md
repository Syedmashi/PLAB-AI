# PLAB AI

Prototype PLAB 2-style clinical simulation app with AI patient roleplay and structured feedback.

## Current scope

- React/Vite frontend.
- Vercel serverless API route at `api/gemini.ts` so the Gemini key stays server-side.
- Initial case library grounded in the supplied PLAB materials: ACS chest pain, pericarditis, carbon monoxide headache, migraine, and obesity counselling.
- Local demo authentication gate using browser storage. Do not use real passwords until production auth is connected.
- Local browser progress/history storage for completed sessions.

## Run locally

**Prerequisite:** Node.js

```bash
npm install
cp .env.example .env.local
# Add your server-side GEMINI_API_KEY to .env.local
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```

## Deploy notes

On Vercel, set `GEMINI_API_KEY` as an environment variable. The frontend calls `/api/gemini`; do not expose Gemini keys through Vite client env variables.

Production gaps before real users:

- Replace local demo auth with a real auth provider.
- Move progress/history from browser localStorage to a user-scoped database.
- Add clinical review for the case library and examiner rubric before marketing as exam-ready.
