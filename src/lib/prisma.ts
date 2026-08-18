import path from "node:path";
import { PrismaClient } from "@/generated/prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

/**
 * Resolve DATABASE_URL to an absolute path.
 *
 * A relative `file:./data/dev.db` is resolved against the current working
 * directory, which differs between `next start` (project root) and the
 * standalone server (`.next/standalone`). Anchoring to the project root keeps
 * every runtime pointing at the same SQLite file.
 */
function resolveDatabaseUrl(): string {
  const url = process.env.DATABASE_URL ?? "file:./data/dev.db";

  if (!url.startsWith("file:")) return url;

  const filePath = url.slice("file:".length);
  if (path.isAbsolute(filePath)) return url;

  const root = process.env.APP_ROOT ?? process.cwd();
  return `file:${path.resolve(root, filePath)}`;
}

function createPrismaClient() {
  return new PrismaClient({
    adapter: new PrismaBetterSqlite3({ url: resolveDatabaseUrl() }),
  });
}

// Reuse the client across hot reloads in development to avoid exhausting
// database connections.
export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
