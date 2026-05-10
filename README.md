# Open PDF Tools

A modern SaaS-style PDF toolkit built with Next.js 15, TypeScript, Tailwind CSS, shadcn-style components, Framer Motion, Zustand, and open-source PDF libraries.

## What is included

- Landing page with hero, features, pricing placeholder, FAQ, navbar, footer, dark mode, OpenGraph, sitemap, robots, and favicon.
- Tool dashboard with search, categories, command palette, cards, empty states, skeleton loading, and mobile responsive layouts.
- Reusable upload workspace with drag-and-drop, reorderable queue, progress, toast notifications, local PDF preview, and error handling.
- Next.js API route for PDF operations using open-source libraries only.
- Placeholders for AdSense, analytics, auth, database, usage limits, premium plans, and future API access.

## Tools

- Merge PDF
- Split PDF
- Compress PDF
- PDF to Images
- Images to PDF
- Rotate PDF
- Delete PDF Pages
- Rearrange PDF Pages
- Add Watermark
- Add Page Numbers
- PDF Metadata Editor
- Unlock PDF best effort
- Extract page images
- Preview PDF

Password locking is intentionally adapter-ready instead of pretending `pdf-lib` can encrypt PDFs. For production-grade lock/unlock, add a free qpdf-compatible WASM or binary adapter that works in your chosen hosting environment.

## Tech stack

- Next.js 15 App Router
- TypeScript
- Tailwind CSS
- shadcn-style local UI primitives
- Framer Motion
- Zustand
- pdf-lib
- pdfjs-dist
- @napi-rs/canvas
- fflate
- react-dropzone
- dnd-kit

## Local setup

```bash
corepack enable
corepack prepare pnpm@9.15.4 --activate
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Useful commands

```bash
pnpm dev
pnpm typecheck
pnpm build
pnpm start
```

## Environment

Copy `.env.example` to `.env.local` when you are ready to configure deployment values.

```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_ANALYTICS_ENABLED=false
NEXT_PUBLIC_ADS_ENABLED=false
DATABASE_URL=
AUTH_SECRET=
ADSENSE_CLIENT_ID=
RATE_LIMIT_REDIS_URL=
```

## Vercel deployment

1. Push the repository to GitHub.
2. Import it in Vercel.
3. Set the package manager to pnpm.
4. Add `NEXT_PUBLIC_APP_URL` with your production URL.
5. Deploy.

The API routes use the Node.js runtime because PDF rendering and image conversion need Node-compatible libraries. Keep file limits conservative on the free tier.

## Architecture notes

- `lib/tools.ts` is the single registry for tool metadata, routing, categories, and icons.
- `components/pdf` owns the reusable upload and processing UI.
- `lib/pdf` owns parsing, rendering, operation logic, and binary responses.
- `lib/security` owns file validation and a simple in-memory rate-limit structure that can be replaced with Redis later.
- `components/ads` contains disabled reusable ad slots for future AdSense integration.

## Beginner extension path

1. Add a new tool to `lib/tools.ts`.
2. Add any custom fields in `components/pdf/tool-runner.tsx`.
3. Add the processing case in `lib/pdf/operations.ts`.
4. Keep route validation in `lib/security/upload-guards.ts`.
5. Run `pnpm typecheck` and `pnpm build`.
