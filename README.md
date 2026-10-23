# Brooklyn Warehouse Coffee

A café management capstone rebuild using React, TypeScript, Vite, and Node.js.

## Current milestone

Frontend development with demonstration data. Customer browsing, cart interaction, reservation-form validation, and local demo summaries are being developed first. Nothing in this milestone creates a real café order, accepts a payment, confirms a booking, or activates Wi-Fi.

## Requirements

- Node.js 24 LTS and npm 11 or later.
- Git; VS Code is recommended.
- MySQL is not needed for the current frontend milestone.

## Run locally

From the project root:

```bash
npm ci
npm run dev
```

- Web: http://localhost:5173
- Admin demo: http://localhost:5173/admin (also linked in the customer footer)
- API health check: http://localhost:3000/api/v1/health
- Frontend only: `npm run dev:web`
- Backend only: `npm run dev:api`

The Vite development server proxies `/api` to the local API. Optional local backend configuration can be created by copying `apps/api/.env.example` to `apps/api/.env`.

## Workspace

| Folder               | Purpose                                             |
| -------------------- | --------------------------------------------------- |
| `apps/web`           | React customer interface and admin demo workspace   |
| `apps/api`           | Express API; health endpoint only at this milestone |
| `apps/portal`        | Future router-compatible captive portal             |
| `packages/contracts` | Shared TypeScript domain types                      |
| `packages/database`  | Future MySQL schema, migrations, seeds              |
| `docs`               | Architecture, development notes, rebuild plan       |

## Checks

```bash
npm run typecheck
npm run lint
npm test
npm run build
```

## GitHub setup

The GitHub upload is pending. See `docs/GITHUB-SETUP.md` for complete Windows/VS Code instructions, including Git initialization after extracting the source ZIP.

Use a private repository named `brooklyn-warehouse` unless you prefer another name. Do not initialize the GitHub repository with a README, license, or `.gitignore` if pushing this existing project.

```bash
git remote add origin https://github.com/YOUR-USERNAME/brooklyn-warehouse.git
git push -u origin main
```

The URL is a placeholder until a repository has actually been created. Never commit `.env`, credentials, a production database dump, real customer records, or `node_modules`.

## Deployment and status

Vite builds static frontend assets to `apps/web/dist`. Configure production hosting to serve `index.html` for application routes. Deploy the Node API separately or behind the same-origin `/api` reverse proxy. Authentication, authoritative pricing, database writes, payment integration, and Wi-Fi control are subsequent milestones.

See `docs/FRONTEND.md` for demo limitations and the API integration path. A license has not been selected; do not assume permission to redistribute café branding or source assets.
