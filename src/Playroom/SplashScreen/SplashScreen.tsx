import { useState, useEffect } from 'react';
import classnames from 'classnames';
import { Logo } from '../Logo/Logo';

import * as stylesheet from './SplashScreen.css';

const {
  animationDuration,
  animationDelay,
  animationIterationCount,
  ...styles
} = stylesheet;

export default () => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const hideSplash = setTimeout(
      () => setHide(true),
      animationDelay + animationDuration * animationIterationCount
    );

    return () => clearTimeout(hideSplash);
  }, []);

  return (
    <div
      className={classnames(styles.root, {
        [styles.hideSplash]: hide,
      })}
      data-testid="splashscreen"
    >
      <div className={classnames(styles.trace, styles.size)}>
        <Logo size="100%" />
      </div>
    </div>
  );
};
