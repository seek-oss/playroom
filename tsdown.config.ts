import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['utils/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist',
    // Doesn't affect the bundle but suppresses a warning we don't care about
    external: ['__PLAYROOM_ALIAS__FRAME_COMPONENT__'],
  },
  {
    entry: ['bin/cli.mts'],
    format: ['esm'],
    dts: false,
    outDir: 'dist',
    platform: 'node',
  },
]);
