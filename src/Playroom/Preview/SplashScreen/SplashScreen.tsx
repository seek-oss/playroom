import clsx from 'clsx';

import { Logo } from '../../Logo/Logo';

import * as styles from './SplashScreen.css';

export default ({ hide }: { hide?: boolean }) => (
  <div
    className={clsx(styles.root, {
      [styles.hideSplash]: hide,
    })}
    data-testid="splashscreen"
    aria-hidden={hide || undefined}
  >
    <div className={clsx(styles.trace, styles.size)}>
      <Logo size="100%" title="Loading Playroom Preview" />
    </div>
  </div>
);
