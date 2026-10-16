# Deploy BizHKEx on Railway

The app is a Vite client plus an Express server. Production listens on `0.0.0.0` and `process.env.PORT`. Railway sets `PORT`; do not hard-code it.

## 1. Deploy from GitHub

1. In Railway, create a project and choose **Deploy from GitHub**.
2. Select `numstation/bizhkex` and the `main` branch.
3. Railway should use the root `Dockerfile` (`railway.toml` sets the builder). The image runs `pnpm install --frozen-lockfile`, `pnpm run build`, then `pnpm start`.

## 2. Public URL

In the service **Networking** settings, generate a Railway domain. Open that URL to confirm the site loads.

## 3. Environment variables

Set variables from `.env.example`. Do not commit real values.

For a first demo deploy:

| Variable | Notes |
| --- | --- |
| `NODE_ENV` | `production` (`pnpm start` also sets this) |
| `JWT_SECRET` | Long random string you generate in Railway. Required for session cookies. |
| `INQUIRY_NOTIFY_EMAIL` | `info@bizhkex.hk` |
| `DATABASE_URL` | Optional. When unset, public office and business pages use the built-in demo catalogue. |

Leave OAuth, Forge, and analytics keys empty until those services are connected. Vite reads `VITE_*` at **build** time, so set any public client keys before the Docker build, then redeploy.

## 4. MySQL later

Add Railway’s MySQL plugin when you want a real database. Copy its connection URL into `DATABASE_URL` and redeploy. Apply the SQL files under `drizzle/` (or run `pnpm db:push` against that database from a trusted machine). Until `0010_office_trust.sql` is applied, a failed office query falls back to the demo catalogue.

## 5. Custom domain

In Railway networking, add `bizhkex.hk`. Point the domain’s DNS at the target Railway shows. Railway issues TLS after DNS verifies. Do that in the DNS host; this repo does not change DNS records.
