import { useContext, useState } from 'react';

import { themeNames } from '../../configModules/themes';
import { StoreContext } from '../../contexts/StoreContext';
import usePreviewUrl from '../../utils/usePreviewUrl';
import { Button } from '../Button/Button';
import { Heading } from '../Heading/Heading';
import { Inline } from '../Inline/Inline';
import { Stack } from '../Stack/Stack';
import PlayIcon from '../icons/PlayIcon';

import { CopyButton } from './CopyButton';
import { ThemeSelector } from './ThemeSelector';

import * as styles from './PreviewSelection.css';

export const PreviewSelection = () => {
  const [{ visibleThemes = [] }] = useContext(StoreContext);
  const defaultTheme =
    visibleThemes && visibleThemes.length > 0
      ? visibleThemes[0]
      : themeNames[0];
  const [userSelectedTheme, setUserSelectedTheme] = useState<
    string | undefined
  >();

  const activeTheme = userSelectedTheme || defaultTheme;

  const isThemed = themeNames.length > 1;

  const prototypeUrl = usePreviewUrl(activeTheme);

  return (
    <div className={styles.root}>
      <Stack space="large">
        <CopyButton copyContent={window.location.href} title="Playroom link" />

        <Stack space="medium">
          <Heading level="3">Preview</Heading>
          {isThemed ? (
            <ThemeSelector
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
              icon={<PlayIcon size={20} />}
            >
              Open
            </Button>
            <CopyButton copyContent={prototypeUrl} title="Preview link" />
          </Inline>
        </Stack>
      </Stack>
    </div>
  );
};
