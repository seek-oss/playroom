import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import type { InlineConfig } from 'vite';

const viteDevConfig: InlineConfig = {
  resolve: {
    conditions: ['...', '@playroom/dev'],
  },
  plugins: [vanillaExtractPlugin()],
};

export default viteDevConfig;
