import type { LoaderFunctionArgs } from "@remix-run/node";

import { prisma } from "~/lib/storage.server.ts";
import { error } from "~/lib/log.server.ts";

export async function loader({ request }: LoaderFunctionArgs) {
  const host =
    request.headers.get("X-Forwarded-Host") ?? request.headers.get("host");

  try {
    await Promise.all([
      prisma.fight.count(),
      fetch(`${new URL(request.url).protocol}${host}`, {
        method: "HEAD",
        headers: { "X-Healthcheck": "true" },
      }).then((r) => {
        if (!r.ok) return Promise.reject(r);
      }),
    ]);
    return new Response("OK");
  } catch (err: unknown) {
    error("healthcheck ❌", err);
    return new Response("ERROR", { status: 500 });
  }
}
