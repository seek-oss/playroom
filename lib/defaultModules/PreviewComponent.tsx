import React, { Fragment, useState, useEffect, ReactNode } from 'react';
import classnames from 'classnames';
import { Logo } from '../../src/Playroom/Logo/Logo';

// @ts-ignore
import styles from './PreviewComponent.less';

interface Props {
  children?: ReactNode;
}

export default ({ children }: Props) => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const hideSplash = setTimeout(() => setHide(true), 4500);

    return () => clearTimeout(hideSplash);
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
