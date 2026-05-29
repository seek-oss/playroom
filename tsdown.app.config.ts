import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { defineConfig } from 'tsdown';

export default defineConfig({
  entry: {
    index: 'src/entries/index.tsx',
    frame: 'src/entries/frame.tsx',
    preview: 'src/entries/preview.tsx',
    'defaultModules/FrameComponent': 'src/defaultModules/FrameComponent.tsx',
    'defaultModules/snippets': 'src/defaultModules/snippets.ts',
    'defaultModules/themes': 'src/defaultModules/themes.ts',
    'defaultModules/useScope': 'src/defaultModules/useScope.ts',
  },
  format: ['esm'],
  dts: false,
  outDir: 'app',
  exports: false,
  platform: 'browser',
  plugins: [vanillaExtractPlugin()],
  copy: ['src/entries/template.html'],
  // Doesn't affect the bundle but suppresses a warning we don't care about
  external: [
    /\.png/,
    '__PLAYROOM_ALIAS__FRAME_COMPONENT__',
    '__PLAYROOM_ALIAS__THEMES__',
    '__PLAYROOM_ALIAS__SNIPPETS__',
    '__PLAYROOM_ALIAS__USE_SCOPE__',
    '__PLAYROOM_ALIAS__COMPONENTS__',
  ],
});
