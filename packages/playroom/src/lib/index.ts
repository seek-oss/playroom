import type { PlayroomConfig } from '../index.ts';

import provideDefaultConfig from './provideDefaultConfig.ts';

export default (userConfig: PlayroomConfig) => {
  const config = provideDefaultConfig(userConfig);

  return {
    start: (callback?: () => void) => {
      import('./start.ts').then(({ default: start }) => {
        start(config, callback);
      });
    },
    build: (callback?: (error?: string) => void) => {
      import('./build.ts').then(({ default: build }) => {
        build(config, callback);
      });
    },
  };
};
