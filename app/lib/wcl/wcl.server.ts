import type { Timeable } from "~/lib/query/types.server.ts";
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

export async function getWclFights(
  params: GetFightsQueryVariables,
  timeable: Timeable,
): Promise<GetFightsQuery> {
  const sdk = await getCachedSdk(timeable);

  return sdk.getFights(params);
}

export async function getPlayerDetails(
  params: GetPlayerDetailsQueryVariables,
  timeable: Timeable,
): Promise<GetPlayerDetailsQuery> {
  const sdk = await getCachedSdk(timeable);

  return sdk.getPlayerDetails(params);
}

export async function getCombatantInfoEvents(
  params: GetCombatantInfoEventsQueryVariables,
  timeable: Timeable,
): Promise<GetCombatantInfoEventsQuery> {
  const sdk = await getCachedSdk(timeable);

  return sdk.getCombatantInfoEvents(params);
}

export async function getPhysicalDamageTakenEvents(
  params: GetPhysicalDamageTakenEventsQueryVariables,
  timeable: Timeable,
): Promise<GetPhysicalDamageTakenEventsQuery> {
  const sdk = await getCachedSdk(timeable);

  return sdk.getPhysicalDamageTakenEvents(params);
}
