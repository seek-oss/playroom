import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';
import path from 'path';

import { mergeConfig, type InlineConfig } from 'vite';

// Only used for playroom development. Resolves to a stub during packaging.
import viteDevConfig from '#vite/devConfig';

import getStaticTypes from './getStaticTypes.mts';
import type { ResolvedPlayroomConfig } from './provideDefaultConfig.mts';

interface MakeViteConfigOptions {
  production?: boolean;
}

const require = createRequire(import.meta.url);

const resolvePlayroomModule = (specifier: string) =>
  fileURLToPath(import.meta.resolve(specifier));

export default async (
  playroomConfig: ResolvedPlayroomConfig,
  options: MakeViteConfigOptions,
): Promise<InlineConfig> => {
  const relativeResolve = (requirePath: string) =>
    require.resolve(requirePath, { paths: [playroomConfig.cwd] });

  const staticTypes = await getStaticTypes(playroomConfig);

  const ourConfig: InlineConfig = {
    base: playroomConfig.baseUrl,
    mode: options.production ? 'production' : 'development',
    root: resolvePlayroomModule('#static/vite'),
    configFile: false,

    build: {
      outDir: path.resolve(playroomConfig.cwd, playroomConfig.outputPath),
      sourcemap: options.production,
      rollupOptions: {
        input: {
          index: resolvePlayroomModule('#static/vite/index.html'),
          frame: resolvePlayroomModule('#static/vite/frame.html'),
          preview: resolvePlayroomModule('#static/vite/preview/index.html'),
        },
      },
      assetsInlineLimit: 0,
    },

    server: playroomConfig.port
      ? {
          port: playroomConfig.port,
          open: playroomConfig.openBrowser,
        }
      : undefined,

    resolve: {
      alias: {
        '/src/index.tsx': resolvePlayroomModule('#entries/index'),
        '/src/frame.tsx': resolvePlayroomModule('#entries/frame'),
        '/src/preview.tsx': resolvePlayroomModule('#entries/preview'),
        __PLAYROOM_ALIAS__COMPONENTS__: relativeResolve(
          playroomConfig.components,
        ),
        __PLAYROOM_ALIAS__SNIPPETS__: playroomConfig.snippets
          ? relativeResolve(playroomConfig.snippets)
          : resolvePlayroomModule('#defaultModules/snippets'),
        __PLAYROOM_ALIAS__THEMES__: playroomConfig.themes
          ? relativeResolve(playroomConfig.themes)
          : resolvePlayroomModule('#defaultModules/themes'),
        __PLAYROOM_ALIAS__FRAME_COMPONENT__: playroomConfig.frameComponent
          ? relativeResolve(playroomConfig.frameComponent)
          : resolvePlayroomModule('#defaultModules/FrameComponent'),
        __PLAYROOM_ALIAS__USE_SCOPE__: playroomConfig.scope
          ? relativeResolve(playroomConfig.scope)
          : resolvePlayroomModule('#defaultModules/useScope'),
      },
    },
    define: {
      __PLAYROOM_GLOBAL__CONFIG__: JSON.stringify(playroomConfig),
      __PLAYROOM_GLOBAL__STATIC_TYPES__: JSON.stringify(staticTypes),
    },
  };

  const theirConfig = (await playroomConfig.viteConfig?.()) ?? {};
  const mergedConfig = mergeConfig(ourConfig, theirConfig);

  return mergeConfig(mergedConfig, viteDevConfig);
};
