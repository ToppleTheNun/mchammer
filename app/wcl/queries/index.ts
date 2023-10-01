import { getCachedSdk } from "#app/wcl/client.server.ts";
import type {
  GetCombatantInfoEventsQuery,
  GetCombatantInfoEventsQueryVariables,
  GetFightsByIdQuery,
  GetFightsByIdQueryVariables,
  GetFightsQuery,
  GetFightsQueryVariables,
  GetPhysicalDamageTakenEventsQuery,
  GetPhysicalDamageTakenEventsQueryVariables,
  GetPlayerDetailsQuery,
  GetPlayerDetailsQueryVariables,
} from "#app/wcl/types";

export const getFights = async (
  params: GetFightsQueryVariables,
): Promise<GetFightsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getFights(params);
};

export const getFightsById = async (
  params: GetFightsByIdQueryVariables,
): Promise<GetFightsByIdQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getFightsById(params);
};

export const getPlayerDetails = async (
  params: GetPlayerDetailsQueryVariables,
): Promise<GetPlayerDetailsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getPlayerDetails(params);
};

export const getCombatantInfoEvents = async (
  params: GetCombatantInfoEventsQueryVariables,
): Promise<GetCombatantInfoEventsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getCombatantInfoEvents(params);
};

export const getPhysicalDamageTakenEvents = async (
  params: GetPhysicalDamageTakenEventsQueryVariables,
): Promise<GetPhysicalDamageTakenEventsQuery> => {
  const sdk = await getCachedSdk();

  return sdk.getPhysicalDamageTakenEvents(params);
};
