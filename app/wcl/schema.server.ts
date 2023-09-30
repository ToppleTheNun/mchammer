import { z } from "zod";

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

export const damageTakenEventSchema = z.object({
  timestamp: z.number(),
  type: z.literal("damage"),
  sourceID: z.number(),
  sourceInstance: z.number().optional(),
  targetID: z.number(),
  targetInstance: z.number().optional(),
  abilityGameID: z.number(),
  fight: z.number(),
  buffs: z.string(),
  hitType: z.number(),
  amount: z.number().default(0),
  mitigated: z.number().default(0),
  unmitigatedAmount: z.number().default(0),
  absorbed: z.number().default(0),
});
export type DamageTakenEvent = z.infer<typeof damageTakenEventSchema>;

export const damageTakenEventArraySchema = z.array(damageTakenEventSchema);
export type DamageTakenEvents = z.infer<typeof damageTakenEventArraySchema>;
