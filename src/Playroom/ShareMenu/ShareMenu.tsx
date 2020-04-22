import React, { Fragment, ReactNode, useState } from 'react';

import ThemeSelector from './ThemeSelector';
import CopyButton from './CopyButton';
import { createPrototypeUrl } from '../../../utils';

// @ts-ignore
// eslint-disable-next-line css-modules/no-unused-class
import styles from './ShareMenu.less';

const baseUrl = `${window.location.protocol}//${window.location.host}`;

const Spacer = () => <div className={styles.vspace} />;
const Divider = () => <div className={styles.divider} />;

const Section = ({
  title,
  description,
  children
}: {
  title: string;
  description: string;
  children: ReactNode;
}) => (
  <Fragment>
    <h4 className={styles.subHeading}>{title}</h4>
    <Spacer />

    <p className={styles.description}>{description}</p>

    <Spacer />
    <Spacer />

    {children}
  </Fragment>
);

interface ShareMenuProps {
  themes: string[];
  code: string;
}
export default ({ themes, code }: ShareMenuProps) => {
  const [activeTheme, setActiveTheme] = useState(themes[0]);
  const isThemed = themes.length > 1;

  const playroomUrl = window.location.href;
  const prototypeUrl = createPrototypeUrl({
    baseUrl,
    code,
    theme: isThemed ? activeTheme : undefined
  });

  return (
    <aside className={styles.root} data-testid="share-menu">
      <h3 className={styles.title}>Share</h3>
      <Spacer />
      <Spacer />

      <Section
        title="Playroom"
        description="Create a link to this playroom. Includes code, themes & device widths."
      >
        <CopyButton copyContent={playroomUrl} />
      </Section>

      <Spacer />
      <Spacer />
      <Spacer />
      <Divider />
      <Spacer />
      <Spacer />
      <Spacer />

      <Section
        title="Prototype"
        description="Create a link to experience this playroom standalone in full screen."
      >
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
        <div className={styles.row}>
          <a className={styles.link} href={prototypeUrl}>
            View prototype
          </a>
          <CopyButton copyContent={prototypeUrl} />
        </div>
      </Section>
    </aside>
  );
};
