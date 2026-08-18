import { prisma } from "@/lib/prisma";

// Used by the Docker/Coolify healthcheck. Verifies the app is up and that the
// SQLite file is reachable.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return Response.json({ status: "ok" });
  } catch (e) {
    console.error("[health] db check failed:", e);
    return Response.json({ status: "error" }, { status: 503 });
  }
}
