import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { defineConfig } from 'tsdown';

export default defineConfig([
  {
    entry: ['utils/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    outDir: 'dist/utils',
    exports: true,
    deps: {
      // Doesn't affect the bundle but suppresses a warning we don't care about
      neverBundle: ['__PLAYROOM_ALIAS__FRAME_COMPONENT__'],
    },
  },
  {
    entry: {
      'entries/index': 'src/entries/index.tsx',
      'entries/frame': 'src/entries/frame.tsx',
      'entries/preview': 'src/entries/preview.tsx',
      'defaultModules/FrameComponent': 'src/defaultModules/FrameComponent.tsx',
      'defaultModules/snippets': 'src/defaultModules/snippets.ts',
      'defaultModules/themes': 'src/defaultModules/themes.ts',
      'defaultModules/useScope': 'src/defaultModules/useScope.ts',
    },
    format: ['esm'],
    dts: false,
    outDir: 'dist/app',
    platform: 'browser',
    plugins: [
      vanillaExtractPlugin({
        identifiers: process.env.PLAYROOM_DEV === 'true' ? 'debug' : 'short',
      }),
    ],
    copy: [{ from: 'static', to: 'dist' }],
    deps: {
      // Doesn't affect the bundle but suppresses a warning we don't care about
      neverBundle: [
        /\.png/,
        '__PLAYROOM_ALIAS__FRAME_COMPONENT__',
        '__PLAYROOM_ALIAS__THEMES__',
        '__PLAYROOM_ALIAS__SNIPPETS__',
        '__PLAYROOM_ALIAS__USE_SCOPE__',
        '__PLAYROOM_ALIAS__COMPONENTS__',
      ],
      // Bundle the sprinkles runtime so consumers don't need
      onlyBundle: ['@vanilla-extract/sprinkles'],
    },
  },
  {
    entry: ['bin/cli.mts'],
    format: ['esm'],
    dts: false,
    outDir: 'dist',
    platform: 'node',
  },
]);
