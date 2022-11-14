import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';

export default defineConfig({
  define: {
    // Codemirror depends on global
    global: 'window',
  },
  resolve: {
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    rollupOptions: {
      input: {
        playroomIndex: resolve(__dirname, '../src/index.html'),
        playroomFrame: resolve(__dirname, '../src/frame.html'),
        playroomPreview: resolve(__dirname, '../src/preview/index.html'),
      },
      external: [
        '__PLAYROOM_ALIAS__THEMES__',
        '__PLAYROOM_ALIAS__COMPONENTS__',
        '__PLAYROOM_ALIAS__SNIPPETS__',
        '__PLAYROOM_ALIAS__FRAME_COMPONENT__',
        '__PLAYROOM_ALIAS__USE_SCOPE__',
      ],
      // output: {
      //   dir: resolve(playroomConfig.cwd, playroomConfig.outputPath),
      //   entryFileNames: '[name].[hash].js',
      // },
    },
  },
  plugins: [react(), vanillaExtractPlugin()],
  root: resolve(__dirname, '../src'),
  server: {
    port: 9000,
    open: true,
  },
});
