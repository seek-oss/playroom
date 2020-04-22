import React, { Fragment, ReactNode, useState, useEffect, useRef } from 'react';
import copy from 'copy-to-clipboard';

import CopyIcon from './CopyIcon';
import ThemeSelector from './ThemeSelector';
import { createPrototypeUrl } from '../../../utils';

// @ts-ignore
import styles from './ShareMenu.less';

const baseUrl = `${window.location.protocol}//${window.location.host}`;

const Spacer = () => <div className={styles.vspace} />;
const SideSpacer = () => <div className={styles.hspace} />;
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

interface CopyButtonProps {
  copyContent: string;
}
const CopyButton = ({ copyContent }: CopyButtonProps) => {
  const [copying, setCopying] = useState(false);
  const copyLocked = useRef(false);

  useEffect(() => {
    if (copying && !copyLocked.current) {
      copyLocked.current = true;

      copy(copyContent);

      setTimeout(() => {
        copyLocked.current = false;

        setCopying(false);
      }, 2000);
    }
  }, [copying, copyContent]);

  const onClick = () => {
    if (!copying) {
      setCopying(true);
    }
  };

  return (
    <button className={styles.copyToClipboard} onClick={onClick}>
      {copying ? (
        'Copied'
      ) : (
        <Fragment>
          Copy link
          <SideSpacer />
          <CopyIcon size="small" />
        </Fragment>
      )}
    </button>
  );
};

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
