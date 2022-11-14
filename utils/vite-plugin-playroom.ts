import _debug from 'debug';
import type { Plugin } from 'vite';
import getStaticTypes from '../lib/getStaticTypes';
import type { PlayroomConfig } from '../src';
import { resolve } from 'path';

const debug = _debug('vite-plugin-playroom');

export const vitePluginPlayroom = (playroomConfig: PlayroomConfig): Plugin => ({
  name: 'hmr-test',
  enforce: 'pre',
  apply: 'serve',
  handleHotUpdate: ({ file, modules }) => {
    debug(`HMR file: ${file}`);
    return modules;
  },
  config: async () => {
    const relativeResolve = (requirePath: string) =>
      require.resolve(requirePath, {
        paths: playroomConfig.cwd ? [playroomConfig.cwd] : undefined,
      });

    const staticTypes = await getStaticTypes(playroomConfig);

    return {
      define: {
        __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
        __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes),
      },
      resolve: {
        alias: {
          __PLAYROOM_ALIAS__COMPONENTS__: relativeResolve(
            playroomConfig.components
          ),
          __PLAYROOM_ALIAS__SNIPPETS__: playroomConfig.snippets
            ? relativeResolve(playroomConfig.snippets)
            : require.resolve('./defaultModules/snippets'),
          __PLAYROOM_ALIAS__THEMES__: playroomConfig.themes
            ? relativeResolve(playroomConfig.themes)
            : require.resolve('./defaultModules/themes'),
          __PLAYROOM_ALIAS__FRAME_COMPONENT__: playroomConfig.frameComponent
            ? relativeResolve(playroomConfig.frameComponent)
            : require.resolve('./defaultModules/FrameComponent.jsx'),
          __PLAYROOM_ALIAS__USE_SCOPE__: playroomConfig.scope
            ? relativeResolve(playroomConfig.scope)
            : require.resolve('./defaultModules/useScope'),
        },
      },
      build: {
        rollupOptions: {
          input: {
            index: resolve(__dirname, '../src/index.html'),
            frame: resolve(__dirname, '../src/frame.html'),
            preview: resolve(__dirname, '../src/preview.html'),
          },
        },
      },
    };
  },
});
