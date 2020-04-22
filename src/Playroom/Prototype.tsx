import React, { useState, ComponentType, useEffect } from 'react';
import lzString from 'lz-string';

import getParamsFromQuery from '../utils/getParamsFromQuery';
// @ts-ignore
import CatchErrors from './CatchErrors/CatchErrors';
// @ts-ignore
import RenderCode from './RenderCode/RenderCode';
import { compileJsx } from '../utils/compileJsx';

interface PrototypeState {
  code?: string;
  themeName?: string;
}
const getStateFromUrl = (): PrototypeState => {
  const params = getParamsFromQuery();

  if (params.code) {
    const { code, theme } = JSON.parse(
      lzString.decompressFromEncodedURIComponent(String(params.code))
    );

    return {
      code: compileJsx(code),
      themeName: theme
    } as PrototypeState;
  }

  return {};
};

export interface PrototypeProps {
  components: Record<string, ComponentType>;
  themes: Record<string, any>;
  FrameComponent: ComponentType<{ themeName: string; theme: any }>;
}
export default ({ themes, components, FrameComponent }: PrototypeProps) => {
  const [{ themeName, code }, setPrototypeState] = useState(getStateFromUrl);

  useEffect(() => {
    const onHashChange = () => {
      setPrototypeState(getStateFromUrl());
    };

    window.addEventListener('hashchange', onHashChange);

    return () => {
      window.removeEventListener('hashchange', onHashChange);
    };
  }, []);

  const resolvedTheme = themeName ? themes[themeName] : null;

  return (
    <CatchErrors code={code}>
      <FrameComponent
        themeName={themeName || '__PLAYROOM__NO_THEME__'}
        theme={resolvedTheme}
      >
        <RenderCode code={code} scope={components} />
      </FrameComponent>
    </CatchErrors>
  );
};
