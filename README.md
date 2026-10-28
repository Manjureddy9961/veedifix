# VeediFix (React + Vite + Tailwind + Supabase)

## Files
- `src/api/auth.js` login, signup, Google | `src/api/issues.js` issues + photo upload | `src/api/admin.js` groups + users
- `src/pages/` Landing, Login (User / Authority / hidden Admin), UserHome, AuthorityHome, AdminHome
- `supabase/schema.sql` tables, security rules, storage | `supabase/functions/notify-telegram/index.ts` Telegram bot alert

## Setup
1. Supabase: create project, SQL Editor, run `supabase/schema.sql`.
2. Authentication > Providers > Email: **turn OFF "Confirm email"** (people register and are logged in directly).
3. Google login (shows the Gmail accounts on the device): Google Cloud Console > APIs & Services > Credentials > OAuth client ID (Web).
   Add the redirect URI shown in Supabase (Authentication > Providers > Google). Paste Client ID and Secret there and enable it.
   Authentication > URL Configuration: set Site URL to your Vercel URL and add `http://localhost:5173` to Redirect URLs.
4. Copy `.env.example` to `.env`, fill the URL and anon key (Project Settings > API).
5. `npm install` then `npm run dev` and open http://localhost:5173
6. First admin: register on the User page, then run the `update profiles set role='admin'` line at the bottom of `schema.sql`.
   Admin login is hidden: press and hold the VeediFix logo for 3 seconds. Make officers in Admin > Users.
7. Telegram: follow the steps at the top of `supabase/functions/notify-telegram/index.ts`.
8. Deploy: push to GitHub, import in Vercel, add the two env vars. `vercel.json` handles page refreshes.
