import React, { useState } from 'react';

import usePreviewUrl from '../../utils/usePreviewUrl';
import { ThemeSelector } from './ThemeSelector';
import { CopyButton } from './CopyButton';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { Stack } from '../Stack/Stack';
import { Inline } from '../Inline/Inline';
import PlayIcon from '../icons/PlayIcon';
import { Button } from '../Button/Button';

interface PreviewPanelProps {
  themes: string[];
  visibleThemes: string[] | undefined;
}
export default ({ themes, visibleThemes }: PreviewPanelProps) => {
  const defaultTheme =
    visibleThemes && visibleThemes.length > 0 ? visibleThemes[0] : themes[0];
  const [userSelectedTheme, setUserSelectedTheme] = useState<
    string | undefined
  >();

  const activeTheme = userSelectedTheme || defaultTheme;

  const isThemed = themes.length > 1;

  const prototypeUrl = usePreviewUrl(activeTheme);

  return (
    <ToolbarPanel data-testid="preview-panel">
      <Stack space="medium">
        <Heading as="h4" level="3">
          Preview
        </Heading>

        {isThemed ? (
          <ThemeSelector
            themes={themes}
            visibleThemes={visibleThemes}
            activeTheme={activeTheme}
            onChange={setUserSelectedTheme}
          />
        ) : null}

        <Inline space="small">
          <Button
            as="a"
            href={prototypeUrl}
            target="_blank"
            title="Open preview in new window"
            rel="noopener noreferrer"
            data-testid="view-prototype"
            icon={<PlayIcon size={20} />}
          >
            Open
          </Button>
          <CopyButton
            copyContent={prototypeUrl}
            title="Copy preview link to clipboard"
          />
        </Inline>
      </Stack>
    </ToolbarPanel>
  );
};
