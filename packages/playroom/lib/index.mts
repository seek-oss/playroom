import type { PlayroomConfig } from '../utils/index.ts';

import provideDefaultConfig from './provideDefaultConfig.mts';

export default (userConfig: PlayroomConfig) => {
  const config = provideDefaultConfig(userConfig);

  return {
    start: (callback?: () => void) => {
      import('./start.mts').then(({ default: start }) => {
        start(config, callback);
      });
    },
    build: (callback?: (error?: string) => void) => {
      import('./build.mts').then(({ default: build }) => {
        build(config, callback);
      });
    },
  };
};
