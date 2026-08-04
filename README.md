# PDFVoid
# Note:- This is just experimental PDFVoid repo, actual repo is private.


A modern SaaS-style PDF toolkit built with Next.js 15, TypeScript, Tailwind CSS, shadcn-style components, Framer Motion, Zustand, and open-source PDF libraries.

## What is included

- Landing page with hero, features, pricing placeholder, FAQ, navbar, footer, dark mode, OpenGraph, sitemap, robots, and favicon.
- Tool dashboard with search, categories, command palette, cards, empty states, skeleton loading, and mobile responsive layouts.
- Reusable upload workspace with drag-and-drop, reorderable queue, progress, toast notifications, local PDF preview, and error handling.
- Client-side merge support for large multi-PDF jobs, avoiding Vercel upload limits.
- Next.js API routes for supported server-side PDF operations using open-source libraries only.
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

Set this in Vercel before going live:

```bash
NEXT_PUBLIC_APP_URL=https://pdfvoid.com
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
4. Add `NEXT_PUBLIC_APP_URL=https://pdfvoid.com`.
5. Add the `pdfvoid.com` domain in Vercel and follow Vercel's DNS instructions.
6. Deploy.

The API routes use the Node.js runtime because PDF rendering and image conversion need Node-compatible libraries. Keep server-side file limits conservative on the free tier.

## Architecture notes

- `lib/site.ts` owns public domain and brand metadata.
- `lib/tools.ts` is the single registry for tool metadata, routing, categories, and icons.
- `components/pdf` owns the reusable upload and processing UI.
- `lib/pdf` owns parsing, rendering, operation logic, and binary responses.
- `lib/security` owns file validation and a simple in-memory rate-limit structure that can be replaced with Redis later.
- `components/ads` contains disabled reusable ad slots for future AdSense integration.
 
