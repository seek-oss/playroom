import React, { useState } from 'react';

import usePreviewUrl from '../../utils/usePreviewUrl';
import { ThemeSelector } from './ThemeSelector';
import { CopyButton } from './CopyButton';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';
import { Stack } from '../Stack/Stack';
import { ShareButton } from './ShareButton';
import { PlayIcon } from './PlayIcon';

interface ShareMenuProps {
  themes: string[];
  visibleThemes: string[] | undefined;
}
export default ({ themes, visibleThemes }: ShareMenuProps) => {
  const defaultTheme =
    visibleThemes && visibleThemes.length > 0 ? visibleThemes[0] : themes[0];
  const [userSelectedTheme, setUserSelectedTheme] = useState();

  const activeTheme = userSelectedTheme || defaultTheme;

  const isThemed = themes.length > 1;

  const playroomUrl = window.location.href;
  const prototypeUrl = usePreviewUrl(activeTheme);

  return (
    <ToolbarPanel data-testid="share-menu">
      <Stack space="large" dividers>
        <Stack space="medium">
          <Heading as="h4" level="3">
            Share Playroom
          </Heading>

          <CopyButton copyContent={playroomUrl} />
        </Stack>

        <Stack space="medium">
          <Heading as="h4" level="3">
            Export Prototype
          </Heading>

          {isThemed ? (
            <ThemeSelector
              themes={themes}
              visibleThemes={visibleThemes}
              activeTheme={activeTheme}
              onChange={setUserSelectedTheme}
            />
          ) : null}

          <Stack space="xsmall">
            <CopyButton copyContent={prototypeUrl} />

            <ShareButton
              as="a"
              href={prototypeUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="view-prototype"
              icon={<PlayIcon size={20} />}
              slim
            >
              Preview
            </ShareButton>
          </Stack>
        </Stack>
      </Stack>
    </ToolbarPanel>
  );
};
