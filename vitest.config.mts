import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      __PLAYROOM_ALIAS__COMPONENTS__: './cypress/projects/basic/components.jsx',
    },
  },
  define: {
    __PLAYROOM_GLOBAL__STATIC_TYPES__: {},
  },
});
