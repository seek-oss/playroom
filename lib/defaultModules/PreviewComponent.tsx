import React, { Fragment, useState, useEffect } from 'react';
import classnames from 'classnames';
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
        <div className={classnames(styles.trace, styles.size)}>
          <Logo size="100%" />
        </div>
      </div>
    </Fragment>
  );
};
