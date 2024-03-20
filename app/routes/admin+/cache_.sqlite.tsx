import process from "node:process";

import { type ActionFunctionArgs, json, redirect } from "@remix-run/node";
import { z } from "zod";

import { cache } from "~/lib/cache.server.ts";
import { getInstanceInfo } from "~/lib/litefs.server";

export async function action({ request }: ActionFunctionArgs) {
  const { currentIsPrimary, primaryInstance } = await getInstanceInfo();
  if (!currentIsPrimary) {
    throw new Error(
      `${request.url} should only be called on the primary instance (${primaryInstance})}`,
    );
  }
  const token = process.env.INTERNAL_COMMAND_TOKEN;
  const isAuthorized =
    request.headers.get("Authorization") === `Bearer ${String(token)}`;
  if (!isAuthorized) {
    // nah, you can't be here...
    return redirect("https://www.youtube.com/watch?v=dQw4w9WgXcQ");
  }
  const { key, cacheValue } = z
    .object({ key: z.string(), cacheValue: z.unknown().optional() })
    .parse(await request.json());
  if (cacheValue === undefined) {
    await cache.delete(key);
  } else {
    // @ts-expect-error - we don't reliably know the type of cacheValue
    await cache.set(key, cacheValue);
  }
  return json({ success: true });
}
