const { defineConfig } = require('vite');
const { resolve } = require('path');
const react = require('@vitejs/plugin-react');
const { vanillaExtractPlugin } = require('@vanilla-extract/vite-plugin');
const getStaticTypes = require('./getStaticTypes');

/** @param {import('../src').PlayroomConfig} playroomConfig */
module.exports = async (playroomConfig, options) => {
  const relativeResolve = (requirePath) =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const staticTypes = await getStaticTypes(playroomConfig);

  return defineConfig({
    // any valid user config options, plus `mode` and `configFile`
    configFile: false,
    base: playroomConfig.baseUrl,
    root: resolve(__dirname, '../src'),
    define: {
      __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
      __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes),
      ...(options.command === 'serve' ? { global: 'window' } : undefined),
    },
    resolve: {
      extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
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
      emptyOutDir: true,
      modulePreload: {
        polyfill: false,
      },
      rollupOptions: {
        input: {
          index: resolve(__dirname, '../src/index.html'),
          frame: resolve(__dirname, '../src/frame.html'),
          preview: resolve(__dirname, '../src/preview/index.html'),
        },
        output: {
          dir: resolve(playroomConfig.cwd, playroomConfig.outputPath),
          entryFileNames: '[name].[hash].js',
        },
      },
    },
    plugins: [react(), vanillaExtractPlugin()],
    ssr: {
      noExternal: ['@babel/standalone'],
    },
    server: {
      port: playroomConfig.port,
      open: playroomConfig.openBrowser,
    },
  });
};
