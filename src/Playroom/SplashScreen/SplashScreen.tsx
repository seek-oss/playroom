import React, { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Logo } from '../Logo/Logo';

import {
  animationDuration,
  animationDelay,
  animationIterationCount,
  // @ts-ignore
} from '!!less-vars-loader!./SplashScreen.less';

// @ts-ignore
import styles from './SplashScreen.less';

export default () => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const hideSplash = setTimeout(
      () => setHide(true),
      parseInt(animationDelay, 10) +
        parseInt(animationDuration, 10) * parseInt(animationIterationCount, 10)
    );

    return () => clearTimeout(hideSplash);
  }, []);

  return (
    <div
      className={classnames(styles.root, {
        [styles.hideSplash]: hide,
      })}
    >
      <div className={classnames(styles.trace, styles.size)}>
        <Logo size="100%" />
      </div>
    </div>
  );
};
