import type { ComponentType, ReactNode } from 'react';
import { useParams } from '../utils/params';
import CatchErrors from './CatchErrors/CatchErrors';
import RenderCode from './RenderCode/RenderCode';

interface FrameProps {
  themes: Record<string, any>;
  components: Record<string, ComponentType>;
  FrameComponent: ComponentType<{
    themeName: string | null;
    theme: string;
    children?: ReactNode;
  }>;
}

export default function Frame({
  themes,
  components,
  FrameComponent,
}: FrameProps) {
  const { themeName, code } = useParams((rawParams) => ({
    themeName:
      typeof rawParams.themeName === 'string' ? rawParams.themeName : '',
    code: typeof rawParams.code === 'string' ? rawParams.code : '',
  }));

  const resolvedThemeName =
    themeName === '__PLAYROOM__NO_THEME__' ? null : themeName;
  const resolvedTheme = resolvedThemeName ? themes[resolvedThemeName] : null;

  return (
    <CatchErrors code={code}>
      <FrameComponent themeName={resolvedThemeName} theme={resolvedTheme}>
        <RenderCode code={code} scope={components} />
      </FrameComponent>
    </CatchErrors>
  );
}
