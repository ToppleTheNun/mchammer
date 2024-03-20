import { z } from "zod";

export const regions = ["US", "EU", "KR", "TW"] as const;
export const RegionSchema = z.enum(regions);
export type Region = z.infer<typeof RegionSchema>;
export function isRegion(x: string): x is Region {
  return RegionSchema.safeParse(x).success;
}
