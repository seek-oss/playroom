const path = require('path');
const react = require('@vitejs/plugin-react');
const vanillaExtractPlugin = require('@vanilla-extract/vite-plugin');
const vite = require('vite');
const getStaticTypes = require('./getStaticTypes');

/**
 * @param {import('../src/index').InternalPlayroomConfig} playroomConfig
 * @param {{ production?: boolean }} options
 * @returns {import('vite').InlineConfig}
 */
module.exports = async (playroomConfig, options) => {
  const relativeResolve = (requirePath) =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const staticTypes = await getStaticTypes(playroomConfig);

  /**
   * @type {import('vite').InlineConfig}
   */
  const ourConfig = {
    base: playroomConfig.baseUrl,
    mode: options.production ? 'production' : 'development',
    plugins: [vanillaExtractPlugin.vanillaExtractPlugin(), react()],
    root: path.resolve(__dirname, './viteHtml'),
    configFile: false,

    build: {
      outDir: path.resolve(playroomConfig.cwd, playroomConfig.outputPath),
      sourcemap: options.production,
      rollupOptions: {
        input: {
          index: path.resolve(__dirname, './viteHtml/index.html'),
          frame: path.resolve(__dirname, './viteHtml/frame.html'),
          preview: path.resolve(__dirname, './viteHtml/preview/index.html'),
        },
      },
    },

    server: playroomConfig.port
      ? {
          port: playroomConfig.port,
          open: playroomConfig.openBrowser,
        }
      : undefined,

    resolve: {
      alias: {
        '/src/index.tsx': path.resolve(__dirname, '../src/index.tsx'),
        '/src/frame.tsx': path.resolve(__dirname, '../src/frame.tsx'),
        '/src/preview.tsx': path.resolve(__dirname, '../src/preview.tsx'),
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
    define: {
      __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
      __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes),
    },
  };

  const theirConfig = playroomConfig.webpackConfig
    ? await playroomConfig.viteConfig()
    : {};

  return vite.mergeConfig(ourConfig, theirConfig);
};
