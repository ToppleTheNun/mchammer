import { z } from "zod";

export const IntegerSchema = z.coerce.number().int();

export const PositiveIntegerSchema = z.coerce.number().int().min(0);

export const ReportCodeSchema = z
  .string()
  .min(16)
  .max(16)
  .regex(/^[a-z0-9]+$/i);
