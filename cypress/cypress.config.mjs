import { defineConfig } from 'cypress';

export default defineConfig({
  defaultCommandTimeout: 10000,
  retries: { openMode: 0, runMode: 2 },
  video: false,
  screenshotsFolder: 'screenshots',
  videosFolder: 'videos',
  e2e: {
    specPattern: 'e2e/**/*.cy.ts',
    supportFile: 'support/e2e.js',
  },
});
