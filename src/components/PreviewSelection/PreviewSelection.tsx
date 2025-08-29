import { useContext, useState } from 'react';

import { themeNames, themesEnabled } from '../../configModules/themes';
import { StoreContext } from '../../contexts/StoreContext';
import usePreviewUrl from '../../utils/usePreviewUrl';
import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import PlayIcon from '../icons/PlayIcon';

import { CopyButton } from './CopyButton';
import { ThemeSelector } from './ThemeSelector';

export const PreviewSelection = () => {
  const [{ selectedThemes }] = useContext(StoreContext);
  const defaultTheme =
    selectedThemes.length > 0 ? selectedThemes[0] : themeNames[0];
  const [userSelectedTheme, setUserSelectedTheme] = useState<
    string | undefined
  >();

  const activeTheme = userSelectedTheme || defaultTheme;

  const prototypeUrl = usePreviewUrl(activeTheme);

  return (
    <Stack space="large">
      <CopyButton copyContent={window.location.href} title="Playroom link" />

      <Stack space="medium">
        <Heading level="3">Preview</Heading>
        {themesEnabled ? (
          <ThemeSelector
            selectedThemes={selectedThemes}
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
            icon={<PlayIcon size={20} />}
          >
            Open
          </Button>
          <CopyButton copyContent={prototypeUrl} title="Preview link" />
        </Inline>
      </Stack>
    </Stack>
  );
};
