import { type GetGqlClientParams, getGqlClient } from "./client.ts";
import {
  GetCombatantInfoEventsDocument,
  type GetCombatantInfoEventsQuery,
  type GetCombatantInfoEventsQueryVariables,
  GetFightsByIdDocument,
  type GetFightsByIdQuery,
  type GetFightsByIdQueryVariables,
  GetFightsDocument,
  type GetFightsQuery,
  type GetFightsQueryVariables,
  GetPhysicalDamageTakenEventsDocument,
  type GetPhysicalDamageTakenEventsQuery,
  type GetPhysicalDamageTakenEventsQueryVariables,
  GetPlayerDetailsDocument,
  type GetPlayerDetailsQuery,
  type GetPlayerDetailsQueryVariables,
} from "./types.ts";

export class WclClient {
  private readonly gqlClient: ReturnType<typeof getGqlClient>;

  constructor(params: GetGqlClientParams) {
    this.gqlClient = getGqlClient(params);
  }

  async getFights(params: GetFightsQueryVariables): Promise<GetFightsQuery> {
    const client = await this.gqlClient;

    const result = await client
      .query<GetFightsQuery, GetFightsQueryVariables>(GetFightsDocument, params)
      .toPromise();
    if (!result.data)
      throw new Error("Unable to retrieve fight data");

    return result.data;
  }

  async getFightsById(
    params: GetFightsByIdQueryVariables,
  ): Promise<GetFightsByIdQuery> {
    const client = await this.gqlClient;

    const result = await client
      .query<GetFightsByIdQuery, GetFightsByIdQueryVariables>(
        GetFightsByIdDocument,
        params,
      )
      .toPromise();
    if (!result.data)
      throw new Error("Unable to retrieve fight by ID data");

    return result.data;
  }

  async getPlayerDetails(
    params: GetPlayerDetailsQueryVariables,
  ): Promise<GetPlayerDetailsQuery> {
    const client = await this.gqlClient;

    const result = await client
      .query<GetPlayerDetailsQuery, GetPlayerDetailsQueryVariables>(
        GetPlayerDetailsDocument,
        params,
      )
      .toPromise();
    if (!result.data)
      throw new Error("Unable to retrieve player details data");

    return result.data;
  }

  async getCombatantInfoEvents(
    params: GetCombatantInfoEventsQueryVariables,
  ): Promise<GetCombatantInfoEventsQuery> {
    const client = await this.gqlClient;

    const result = await client
      .query<GetCombatantInfoEventsQuery, GetCombatantInfoEventsQueryVariables>(
        GetCombatantInfoEventsDocument,
        params,
      )
      .toPromise();
    if (!result.data)
      throw new Error("Unable to retrieve combatant info events data");

    return result.data;
  }

  async getPhysicalDamageTakenEvents(
    params: GetPhysicalDamageTakenEventsQueryVariables,
  ): Promise<GetPhysicalDamageTakenEventsQuery> {
    const client = await this.gqlClient;

    const result = await client
      .query<
        GetPhysicalDamageTakenEventsQuery,
        GetPhysicalDamageTakenEventsQueryVariables
      >(GetPhysicalDamageTakenEventsDocument,
        params,
      )
      .toPromise();
    if (!result.data)
      throw new Error("Unable to retrieve physical damage taken events data");

    return result.data;
  }
}

export * from "./zod.ts";
export * from "./types.js";
