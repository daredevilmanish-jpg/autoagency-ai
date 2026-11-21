# AutoAgency AI MVP

A separate Next.js application with a human-approved Sales Agent, Builder Agent, QA Agent, and shared pipeline dashboard.

## Setup

1. Run `npm install` and `npm run dev`.
2. Open http://localhost:3000.
3. For AI generation, configure `AI_GATEWAY_API_KEY` in `.env.local` (and in Vercel environment variables). Optionally configure `AI_MODEL` to an available AI Gateway model.
4. Push this directory to a **new** GitHub repository and import it as a separate Vercel project.

## Current MVP limitations

- Lead and project data are stored in **the current browser's localStorage**, not a shared server database. Do not use sensitive client information or rely on this for production records.
- The app does not autonomously discover leads, send emails, accept payments, write/deploy customer websites, or execute QA tests. Agents generate drafts, implementation briefs, and test plans.
- Approval changes a draft's status only. Outreach is always manual.
- Add authentication, a persistent database, CRM integrations, rate limiting, audit logs, and an actual build/deploy worker before production use.
