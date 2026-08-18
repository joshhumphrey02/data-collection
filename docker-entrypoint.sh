#!/bin/sh
set -e

# Apply any pending migrations before the server accepts traffic. This is
# idempotent, so it is safe on every container start (including redeploys
# against an existing volume).
echo "==> Applying database migrations..."
npx prisma migrate deploy

echo "==> Starting Next.js..."
exec "$@"
