#!/bin/sh
set -e

# Apply any pending migrations before the server accepts traffic. This is
# idempotent, so it is safe on every container start, including redeploys
# against an existing volume.
#
# The CLI is invoked by path rather than through `npx` so it never attempts a
# network fetch as the unprivileged runtime user.
echo "==> Applying database migrations..."
node ./node_modules/prisma/build/index.js migrate deploy

echo "==> Starting Next.js..."
exec "$@"
