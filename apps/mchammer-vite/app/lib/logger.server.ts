import pino from "pino";

export const logger = pino({
  name: "mchammer",
  level: process.env.PINO_LOG_LEVEL ?? "info",
});

export const getLogger = (pathSegments: string[]) =>
  logger.child({ name: ["mchammer", ...pathSegments].join(":") });
