import process from "node:process";

import {
  getInstanceInfo,
  getInternalInstanceDomain,
} from "~/lib/litefs.server.ts";

export async function updatePrimaryCacheValue({
  key,
  cacheValue,
}: {
  key: string;
  cacheValue: unknown;
}) {
  const { currentIsPrimary, primaryInstance } = await getInstanceInfo();
  if (currentIsPrimary) {
    throw new Error(
      `updatePrimaryCacheValue should not be called on the primary instance (${primaryInstance})}`,
    );
  }
  const domain = getInternalInstanceDomain(primaryInstance);
  const token = process.env.INTERNAL_COMMAND_TOKEN;
  return fetch(`${domain}/admin/cache/sqlite`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${String(token)}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ key, cacheValue }),
  });
}
