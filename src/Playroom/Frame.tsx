import type { ReactNode } from 'react';
import { useParams } from '../utils/params';
import CatchErrors from './CatchErrors/CatchErrors';
// @ts-expect-error
import RenderCode from './RenderCode/RenderCode';

interface FrameProps {
  themes: Record<string, any>;
  components: any[];
  FrameComponent: React.ComponentType<{
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
  const { themeName, code } = useParams((rawParams) => {
    const rawThemeName = rawParams.get('themeName');
    const rawCode = rawParams.get('code');

    return {
      themeName: rawThemeName || '',
      code: rawCode || '',
    };
  });

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
