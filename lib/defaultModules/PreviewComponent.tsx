import React, { Fragment, useState, useEffect } from 'react';
import classnames from 'classnames';
import { Stack } from '../../src/Playroom/Stack/Stack';
import { Heading } from '../../src/Playroom/Heading/Heading';
import { Logo } from '../../src/Playroom/Logo/Logo';

// @ts-ignore
import styles from './PreviewComponent.less';

export default ({ children }) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    setTimeout(() => setHide(true), 3000);
  }, []);

  return (
    <Fragment>
      {children}
      <div
        className={classnames(styles.root, {
          [styles.hideSplash]: hide
        })}
      >
        <Stack space="xlarge">
          <div className={classnames(styles.trace, styles.size)}>
            <Logo size="100%" />
          </div>
          <Heading level="2" as="div" weight="weak">
            Loading preview
          </Heading>
        </Stack>
      </div>
    </Fragment>
  );
};
