import process from 'node:process';

import pino from 'pino';

export const logger = pino({
  name: 'mchammer',
  level: process.env.PINO_LOG_LEVEL ?? 'info',
});

export function getLogger(pathSegments: string[]) {
  return logger.child({ name: ['mchammer', ...pathSegments].join(':') });
}
