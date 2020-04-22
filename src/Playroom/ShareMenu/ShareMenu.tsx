import React, { Fragment, useState } from 'react';

import ThemeSelector from './ThemeSelector';
import CopyButton from './CopyButton';

// @ts-ignore
// eslint-disable-next-line css-modules/no-unused-class
import styles from './ShareMenu.less';
import usePrototypeUrl from '../../utils/usePrototypeUrl';

const Spacer = () => <div className={styles.vspace} />;
const Divider = () => <div className={styles.divider} />;

interface ShareMenuProps {
  themes: string[];
}
export default ({ themes }: ShareMenuProps) => {
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const isThemed = themes.length > 1;

  const playroomUrl = window.location.href;
  const prototypeUrl = usePrototypeUrl(activeTheme);

  return (
    <aside className={styles.root} data-testid="share-menu">
      <h4 className={styles.subHeading}>Share Playroom</h4>

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

      <h4 className={styles.subHeading}>Export Prototype</h4>

      <Spacer />
      <Spacer />

      {isThemed ? (
        <Fragment>
          <ThemeSelector
            themes={themes}
            activeTheme={activeTheme}
            onChange={setActiveTheme}
          />
          <Spacer />
          <Spacer />
        </Fragment>
      ) : null}
      <CopyButton copyContent={prototypeUrl} />
    </aside>
  );
};
