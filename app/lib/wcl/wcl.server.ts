import type { Timings } from "~/lib/timing.server.ts";
import { getCachedSdk } from "~/lib/wcl/client.server.ts";
import type {
  GetCombatantInfoEventsQuery,
  GetCombatantInfoEventsQueryVariables,
  GetFightsQuery,
  GetFightsQueryVariables,
  GetPhysicalDamageTakenEventsQuery,
  GetPhysicalDamageTakenEventsQueryVariables,
  GetPlayerDetailsQuery,
  GetPlayerDetailsQueryVariables,
} from "~/lib/wcl/types.server.ts";

export async function getFights(
  params: GetFightsQueryVariables,
  { timings }: { timings: Timings },
): Promise<GetFightsQuery> {
  const sdk = await getCachedSdk({ timings });

  return sdk.getFights(params);
}

export async function getPlayerDetails(
  params: GetPlayerDetailsQueryVariables,
  { timings }: { timings: Timings },
): Promise<GetPlayerDetailsQuery> {
  const sdk = await getCachedSdk({ timings });

  return sdk.getPlayerDetails(params);
}

export async function getCombatantInfoEvents(
  params: GetCombatantInfoEventsQueryVariables,
  { timings }: { timings: Timings },
): Promise<GetCombatantInfoEventsQuery> {
  const sdk = await getCachedSdk({ timings });

  return sdk.getCombatantInfoEvents(params);
}

export async function getPhysicalDamageTakenEvents(
  params: GetPhysicalDamageTakenEventsQueryVariables,
  { timings }: { timings: Timings },
): Promise<GetPhysicalDamageTakenEventsQuery> {
  const sdk = await getCachedSdk({ timings });

  return sdk.getPhysicalDamageTakenEvents(params);
}
