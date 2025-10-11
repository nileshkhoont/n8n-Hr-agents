# n8n HR Agents (Candidate Suite)

A lightweight React + Vite dashboard to view and manage candidate data sourced from a Google Sheet (CSV export). The project uses Tailwind CSS and a shadcn-like local component collection for the UI.

Features
- View candidate details in a searchable dashboard
- Manage candidates (add/edit/delete) via the Manage Candidates page
- Accept/Reject selection queue entries (integrates with an n8n webhook in examples)
- Clean card-based candidate detail view, plus CSV parsing via papaparse

Quick start
1. Install dependencies

```bash
npm install
```

2. Start the dev server

```bash
npm run dev
```

Open `https://hragent.movyainfotech.com/` in your browser.

Project structure
- `src/` - main application source
	- `components/` - UI components (NavBar, CandidateDropdown, CandidateDetails, etc.)
	- `hooks/` - custom hooks (`useCandidateData`, `useCandidateSelection`, etc.)
	- `lib/` - helper utilities and API wrappers (Google Sheets helpers)
	- `pages/` - route pages (`Index.tsx`, `ManageCandidates.tsx`)
- `public/` - static assets (favicon, logos)
- `index.html` - app entry HTML

Data source
Candidate data is fetched from a Google Sheets CSV export URL configured in `src/hooks/useCandidateData.ts` (`CSV_URL`). To use your own sheet:

1. Make the sheet viewable (or published) and copy the CSV export link.
2. Replace the `CSV_URL` in `useCandidateData.ts` with your link.

Scripts
- `npm run dev` - start Vite development server
- `npm run build` - build production assets
- `npm run preview` - preview the production build locally
- `npm run lint` - run ESLint

Notes & customization
- Replace `public/movya-logo.svg` with your official logo to show it in the header and as the favicon.
- The `ManageCandidates` page includes example webhooks (n8n). Replace those endpoints with yours before using in production.

Contributing
1. Fork the project and create a feature branch
2. Implement your changes and test locally
3. Open a pull request with a clear description

Need help?
If you want, I can:
- Add a CONTRIBUTING.md and PR template
- Generate a production `favicon.ico` fallback file from the SVG
- Add unit tests for the CSV parsing and sorting logic

---
