import process from 'node:process';

import {
  unstable_createViteServer,
  unstable_loadViteServerBuild,
} from '@remix-run/dev';
import { createRequestHandler } from '@remix-run/express';
import { installGlobals } from '@remix-run/node';
import express from 'express';
import { wrapExpressCreateRequestHandler } from '@sentry/remix';
import { pino } from 'pino';
import { pinoHttp } from 'pino-http';

const logger = pino({ name: 'mchammer:server' });

installGlobals();

const vite
  = process.env.NODE_ENV === 'production'
    ? undefined
    : await unstable_createViteServer();

const app = express();

// http logging
if (process.env.NODE_ENV === 'production')
  app.use(pinoHttp());

// handle asset requests
if (vite) {
  app.use(vite.middlewares);
}
else {
  app.use(
    '/build',
    express.static('public/build', { immutable: true, maxAge: '1y' }),
  );
}
app.use(express.static('public', { maxAge: '1h' }));

const createHandler = vite
  ? createRequestHandler
  : wrapExpressCreateRequestHandler(createRequestHandler);
const handlerBuild = vite
  ? () => unstable_loadViteServerBuild(vite)
  : await import('./build/index.js');

// handle SSR requests
app.all(
  '*',
  createHandler({
    build: handlerBuild,
  }),
);

const port = process.env.PORT ?? 3000;
app.listen(port, () =>
  logger.info(`App is listening on http://localhost:${port}`));
