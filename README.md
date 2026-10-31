# BORHAN TELECOM
React + Vite + Tailwind + Firebase SPA (user panel + admin panel, Bangla/English).

## Run
npm install && npm run dev

## Firebase setup (Realtime Database)
1. Authentication → enable Email/Password. Realtime Database → Create database (production/locked mode).
2. Copy the database URL shown at the top of the Data tab into `VITE_FIREBASE_DATABASE_URL` (Cloudflare env var or `.env`) if it differs from the default in `src/firebase/config.js`.
3. Realtime Database → Rules → paste the contents of `database.rules.json` → Publish.
4. Admin approval: after someone registers at `/admin/register`, open Realtime Database → Data → `admins/<uid>/status` and change `pending` to `approved`. Console edits bypass rules, so nobody can self-approve. Your own first account is approved the same way.
5. Auth → Settings → Authorized domains: add your `*.workers.dev` / custom domain.
No Firestore or Storage is used (no images).

## Cloudflare deploy
`wrangler.jsonc` serves `dist/` with SPA fallback. Build command `npm run build`, deploy command `npx wrangler deploy`, root directory `/`.

## Roles
Customers register at `/register` and order from the offer page (`orders`, status `pending`). Admins request access at `/admin/register` and are approved manually in the console (see above). Online payment is not integrated.

## Mobile app (PWA + Android APK)
The site is an installable PWA (`public/manifest.webmanifest`, `public/sw.js`, icons in `public/icons`).
- Android Chrome: menu → Install app (or the 📲 button in the site's ☰ menu). iPhone Safari: Share → Add to Home Screen.
- Android APK/AAB: open https://www.pwabuilder.com, enter the live URL, Package for stores → Android, download, and sign. Add the generated `assetlinks.json` under `public/.well-known/` and redeploy so the app opens without the browser bar.
- Add your live domain to Firebase → Authentication → Settings → Authorized domains.
