import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/entries/index.tsx',
    frame: 'src/entries/frame.tsx',
    preview: 'src/entries/preview.tsx',
  },
  format: ['esm'],
  dts: true,
  outDir: 'src-dist',
  exports: false,
  loader: {
    '.png': 'asset',
  },
  platform: 'browser',
  plugins: [vanillaExtractPlugin()],
  // Doesn't affect the bundle but suppresses a warning we don't care about
  external: [
    '__PLAYROOM_ALIAS__FRAME_COMPONENT__',
    '__PLAYROOM_ALIAS__THEMES__',
    '__PLAYROOM_ALIAS__SNIPPETS__',
    '__PLAYROOM_ALIAS__USE_SCOPE__',
    '__PLAYROOM_ALIAS__COMPONENTS__',
  ],
});
