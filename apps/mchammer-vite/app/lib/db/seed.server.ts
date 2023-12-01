import { makeTimings } from '~/lib/timing.server.ts';
import { ingestWarcraftLogsReport } from '~/ingest/log.server.ts';

(async () => {
  console.log('Starting drizzle seeding...');
  const timings = makeTimings('drizzle seed');
  await ingestWarcraftLogsReport('qydYpAkQD249NFT3', timings);
  console.log('Finished drizzle seeding!');
})().catch(console.error);
