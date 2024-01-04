import { getCachedSdk } from "~/wcl/client.server.ts";
import type {
  GetCombatantInfoEventsQuery,
  GetCombatantInfoEventsQueryVariables,
  GetFightsQuery,
  GetFightsQueryVariables,
  GetPhysicalDamageTakenEventsQuery,
  GetPhysicalDamageTakenEventsQueryVariables,
  GetPlayerDetailsQuery,
  GetPlayerDetailsQueryVariables,
} from "~/wcl/types.server.ts";

export async function getFights(
  params: GetFightsQueryVariables,
): Promise<GetFightsQuery> {
  const sdk = await getCachedSdk();

  return sdk.getFights(params);
}

export async function getPlayerDetails(
  params: GetPlayerDetailsQueryVariables,
): Promise<GetPlayerDetailsQuery> {
  const sdk = await getCachedSdk();

  return sdk.getPlayerDetails(params);
}

export async function getCombatantInfoEvents(
  params: GetCombatantInfoEventsQueryVariables,
): Promise<GetCombatantInfoEventsQuery> {
  const sdk = await getCachedSdk();

  return sdk.getCombatantInfoEvents(params);
}

export async function getPhysicalDamageTakenEvents(
  params: GetPhysicalDamageTakenEventsQueryVariables,
): Promise<GetPhysicalDamageTakenEventsQuery> {
  const sdk = await getCachedSdk();

  return sdk.getPhysicalDamageTakenEvents(params);
}
