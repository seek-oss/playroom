import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  retries: { openMode: 0, runMode: 2 },
  video: false,
  e2e: {},
});
