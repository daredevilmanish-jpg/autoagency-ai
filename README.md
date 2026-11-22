# AutoAgency AI MVP

A Next.js application with a human-approved Sales Agent, Website Builder planning Agent, QA planning Agent, and browser-local pipeline dashboard.

## Gemini setup

1. Create a Gemini API key at https://aistudio.google.com/api-keys. Do not commit it to GitHub or paste it in a chat.
2. In Vercel, open this project's **Settings > Environment Variables**. Add `GEMINI_API_KEY` with your key as its value, scoped to Production (and Preview if you plan to test preview deployments). Save as a sensitive variable if the UI offers that option.
3. Optional: set `GEMINI_MODEL` to a supported Gemini model ID. The default is `gemini-3.5-flash-lite`.
4. Redeploy after adding or changing environment variables.
5. For local development, run `npm install`, create a local `.env.local` file containing `GEMINI_API_KEY=...`, then run `npm run dev` and visit http://localhost:3000.

The server route at `app/api/agent/route.ts` calls the Gemini API directly. It does not use Vercel AI Gateway or expose the key in client-side code. API availability, costs, rate limits, data processing terms, and billing eligibility are set by Google and may change.

## Current MVP limitations

- Lead and project data are stored in **the current browser's localStorage**, not a shared server database. Do not use sensitive client information or rely on this for production records.
- The app does not autonomously discover leads, send emails, accept payments, write/deploy customer websites, or execute QA tests. Agents generate drafts, implementation briefs, and test plans.
- Approval changes a draft's status only. Outreach is always manual.
- The public API does not yet have authentication or rate limiting; add both before inviting users or commercializing the service to prevent unauthorized quota consumption.
- Add authentication, a persistent database, CRM integrations, rate limiting, audit logs, and an actual build/deploy worker before production use.
