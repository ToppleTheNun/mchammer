import type { DataFunctionArgs } from "@remix-run/node";
import { sql } from "drizzle-orm";

import { dodgeParryMissStreak } from "~/lib/db/schema.ts";
import { getLogger } from "~/lib/logger.server.ts";
import { pg } from "~/lib/storage.server.ts";

const logger = getLogger(["resources", "healthcheck"]);

export async function loader({ request }: DataFunctionArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    await Promise.all([
      pg
        .select({ count: sql<number>`cast(count(*) as int)` })
        .from(dodgeParryMissStreak),
      fetch(`${new URL(request.url).protocol}${host}`, {
        method: "HEAD",
        headers: { "X-Healthcheck": "true" },
      }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (error: unknown) {
    logger.error({ err: error }, "healthcheck ❌");
    return new Response("ERROR", { status: 500 });
  }
}
