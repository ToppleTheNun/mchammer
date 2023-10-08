import { getGqlClient } from "#app/wcl/client.server.ts";
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
} from "#app/wcl/types.ts";
import {
  GetCombatantInfoEventsDocument,
  GetFightsByIdDocument,
  GetFightsDocument,
  GetPhysicalDamageTakenEventsDocument,
  GetPlayerDetailsDocument,
} from "#app/wcl/types.ts";

export const getFights = async (
  params: GetFightsQueryVariables,
): Promise<GetFightsQuery> => {
  const client = await getGqlClient();

  const result = await client
    .query<GetFightsQuery, GetFightsQueryVariables>(GetFightsDocument, params)
    .toPromise();
  if (!result.data) {
    throw new Error("Unable to retrieve fight data");
  }
  return result.data;
};

export const getFightsById = async (
  params: GetFightsByIdQueryVariables,
): Promise<GetFightsByIdQuery> => {
  const client = await getGqlClient();

  const result = await client
    .query<GetFightsByIdQuery, GetFightsByIdQueryVariables>(
      GetFightsByIdDocument,
      params,
    )
    .toPromise();
  if (!result.data) {
    throw new Error("Unable to retrieve fight by ID data");
  }
  return result.data;
};

export const getPlayerDetails = async (
  params: GetPlayerDetailsQueryVariables,
): Promise<GetPlayerDetailsQuery> => {
  const client = await getGqlClient();

  const result = await client
    .query<GetPlayerDetailsQuery, GetPlayerDetailsQueryVariables>(
      GetPlayerDetailsDocument,
      params,
    )
    .toPromise();
  if (!result.data) {
    throw new Error("Unable to retrieve player details data");
  }
  return result.data;
};

export const getCombatantInfoEvents = async (
  params: GetCombatantInfoEventsQueryVariables,
): Promise<GetCombatantInfoEventsQuery> => {
  const client = await getGqlClient();

  const result = await client
    .query<GetCombatantInfoEventsQuery, GetCombatantInfoEventsQueryVariables>(
      GetCombatantInfoEventsDocument,
      params,
    )
    .toPromise();
  if (!result.data) {
    throw new Error("Unable to retrieve combatant info events data");
  }
  return result.data;
};

export const getPhysicalDamageTakenEvents = async (
  params: GetPhysicalDamageTakenEventsQueryVariables,
): Promise<GetPhysicalDamageTakenEventsQuery> => {
  const client = await getGqlClient();

  const result = await client
    .query<
      GetPhysicalDamageTakenEventsQuery,
      GetPhysicalDamageTakenEventsQueryVariables
    >(GetPhysicalDamageTakenEventsDocument, params)
    .toPromise();
  if (!result.data) {
    throw new Error("Unable to retrieve physical damage taken events data");
  }
  return result.data;
};
