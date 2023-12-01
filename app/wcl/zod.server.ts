import { z } from 'zod';

export const wclOAuthResponseSchema = z.object({
  access_token: z.string(),
  expires_in: z.number().int(),
  token_type: z.literal('Bearer'),
});
export type WCLOAuthResponse = z.infer<typeof wclOAuthResponseSchema>;

export const wclAuthSchema = z.object({
  expiresAt: z.number().int(),
  token: z.string(),
});
export type WCLAuth = z.infer<typeof wclAuthSchema>;

export const playerDetailSpecSchema = z.object({
  spec: z.string(),
  count: z.number(),
});
export type PlayerDetailSpec = z.infer<typeof playerDetailSpecSchema>;

export const playerDetailSchema = z.object({
  name: z.string(),
  id: z.number(),
  guid: z.number(),
  // this is the player's class
  type: z.string(),
  server: z.string(),
});
export type PlayerDetail = z.infer<typeof playerDetailSchema>;

export const playerDetailsArraySchema = z.array(playerDetailSchema);
export type PlayerDetailArray = z.infer<typeof playerDetailsArraySchema>;

export const playerDetailsDpsHealerTankSchema = z.object({
  dps: playerDetailsArraySchema.default([]),
  healers: playerDetailsArraySchema.default([]),
  tanks: playerDetailsArraySchema.default([]),
});
export type PlayerDetailsDpsHealerTank = z.infer<
  typeof playerDetailsDpsHealerTankSchema
>;

export const playerDetailsResponseSchema = z.object({
  data: z.object({
    playerDetails: playerDetailsDpsHealerTankSchema,
  }),
});
export type PlayerDetailsResponse = z.infer<typeof playerDetailsResponseSchema>;

export const damageTakenEventSchema = z.object({
  timestamp: z.number(),
  type: z.literal('damage'),
  sourceID: z.number(),
  sourceInstance: z.number().optional(),
  targetID: z.number(),
  targetInstance: z.number().optional(),
  abilityGameID: z.number(),
  fight: z.number(),
  buffs: z.string().optional(),
  hitType: z.number(),
  amount: z.number().default(0),
  mitigated: z.number().default(0),
  unmitigatedAmount: z.number().default(0),
  absorbed: z.number().default(0),
});
export type DamageTakenEvent = z.infer<typeof damageTakenEventSchema>;

export const damageTakenEventArraySchema = z.array(damageTakenEventSchema);
export type DamageTakenEvents = z.infer<typeof damageTakenEventArraySchema>;
