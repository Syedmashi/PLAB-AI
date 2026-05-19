# PLAB AI Delivery Checklist

## Verified in this local pass

- `npm run lint` passes.
- `npm run build` passes.
- SPA routes are configured for Vercel through `vercel.json`.
- Gemini API key is server-side only through `api/gemini.ts`.
- Frontend calls `/api/gemini`; no direct Gemini SDK/API key usage in client source or bundle.
- Demo auth gates protected routes locally.
- Completed sessions are saved locally in the browser and shown on Dashboard/Profile/History.
- Case library includes PLAB-style scenarios from supplied materials:
  - ACS telephone chest pain
  - Pericarditis
  - Carbon monoxide headache
  - Migraine
  - Obesity counselling
  - Paediatric asthma telephone emergency
  - Depression with suicide risk assessment
  - Possible ectopic pregnancy
- Landing page no longer uses fake testimonials, fake rating, or unverified GMC claims.
- External placeholder image/font calls were removed from source.

## Still required before real public delivery

1. Replace local demo auth with production auth.
2. Replace localStorage progress with a user-scoped database.
3. Add clinician review/sign-off for all case content and rubrics.
4. Add privacy policy / terms pages before collecting real user data.
5. Configure `GEMINI_API_KEY` on Vercel.
6. Deploy to Vercel and smoke-test live routes:
   - `/`
   - `/auth`
   - `/dashboard`
   - `/cases`
   - `/history`
   - `/profile`
   - `/simulation?caseId=acs-telephone`
7. Add monitoring/error logging before paid or public launch.

## Known local limitation

OpenClaw browser policy blocked local browser navigation during this pass, so local route checks were done with Vite preview HTTP responses rather than visual browser automation.
