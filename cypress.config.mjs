import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  video: false,
  e2e: {},
  retries: {
    runMode: 2,
    openMode: 0,
  },
});
