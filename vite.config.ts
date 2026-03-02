import { vanillaExtractPlugin } from '@vanilla-extract/rollup-plugin';
import { nodeExternals } from 'rollup-plugin-node-externals';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    minify: false,
    outDir: 'dist/src',
    lib: {
      entry: {
        index: 'src/entries/index.tsx',
        frame: 'src/entries/frame.tsx',
        preview: 'src/entries/preview.tsx',
        'defaultModules/FrameComponent':
          'src/defaultModules/FrameComponent.tsx',
        'defaultModules/snippets': 'src/defaultModules/snippets.ts',
        'defaultModules/themes': 'src/defaultModules/themes.ts',
        'defaultModules/useScope': 'src/defaultModules/useScope.ts',
      },
      formats: ['es'],
    },
    rollupOptions: {
      external: [
        '__PLAYROOM_ALIAS__FRAME_COMPONENT__',
        '__PLAYROOM_ALIAS__THEMES__',
        '__PLAYROOM_ALIAS__SNIPPETS__',
        '__PLAYROOM_ALIAS__USE_SCOPE__',
        '__PLAYROOM_ALIAS__COMPONENTS__',
      ],
    },
  },
  plugins: [vanillaExtractPlugin(), nodeExternals()],
});
