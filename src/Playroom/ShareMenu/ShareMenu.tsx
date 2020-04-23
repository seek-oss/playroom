import React, { Fragment, useState } from 'react';

import usePreviewUrl from '../../utils/usePreviewUrl';
import ThemeSelector from './ThemeSelector';
import CopyButton from './CopyButton';
import { Heading } from '../Heading/Heading';
import { ToolbarPanel } from '../ToolbarPanel/ToolbarPanel';

// @ts-ignore
// eslint-disable-next-line css-modules/no-unused-class
import styles from './ShareMenu.less';

const Spacer = () => <div className={styles.vspace} />;
const Divider = () => <div className={styles.divider} />;

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
      <Heading as="h4" level="3">
        Share Playroom
      </Heading>

      <Spacer />
      <Spacer />
      <CopyButton copyContent={playroomUrl} />

      <Spacer />
      <Spacer />
      <Spacer />
      <Divider />
      <Spacer />
      <Spacer />
      <Spacer />

      <Heading as="h4" level="3">
        Export Prototype
      </Heading>

      <Spacer />
      <Spacer />

      {isThemed ? (
        <Fragment>
          <ThemeSelector
            themes={themes}
            visibleThemes={visibleThemes}
            activeTheme={activeTheme}
            onChange={setUserSelectedTheme}
          />
          <Spacer />
          <Spacer />
        </Fragment>
      ) : null}
      <CopyButton copyContent={prototypeUrl} />
    </ToolbarPanel>
  );
};
