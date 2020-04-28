import React, { useState, ComponentType, useEffect, ReactNode } from 'react';
import lzString from 'lz-string';

import getParamsFromQuery from '../utils/getParamsFromQuery';
// @ts-ignore
import CatchErrors from './CatchErrors/CatchErrors';
// @ts-ignore
import RenderCode from './RenderCode/RenderCode';
import { compileJsx } from '../utils/compileJsx';

interface PreviewState {
  code?: string;
  themeName?: string;
}
const getStateFromUrl = (): PreviewState => {
  const params = getParamsFromQuery();

  if (params.code) {
    const { code, theme } = JSON.parse(
      lzString.decompressFromEncodedURIComponent(String(params.code))
    );

    return {
      code: compileJsx(code),
      themeName: theme
    } as PreviewState;
  }

  return {};
};

export interface PreviewProps {
  components: Record<string, ComponentType>;
  themes: Record<string, any>;
  FrameComponent: ComponentType<{ themeName: string; theme: any }>;
  PreviewComponent: ComponentType<{ children: ReactNode }>;
}
export default ({
  themes,
  components,
  FrameComponent,
  PreviewComponent
}: PreviewProps) => {
  const [{ themeName, code }, setPreviewState] = useState(getStateFromUrl);

  useEffect(() => {
    const onHashChange = () => {
      setPreviewState(getStateFromUrl());
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
        <PreviewComponent>
          <RenderCode code={code} scope={components} />
        </PreviewComponent>
      </FrameComponent>
    </CatchErrors>
  );
};
