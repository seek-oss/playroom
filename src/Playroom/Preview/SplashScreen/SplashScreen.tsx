import classnames from 'classnames';

import { Logo } from '../../Logo/Logo';

import * as styles from './SplashScreen.css';

export default ({ hide }: { hide?: boolean }) => (
  <div
    className={classnames(styles.root, {
      [styles.hideSplash]: hide,
    })}
    data-testid="splashscreen"
    aria-hidden={hide || undefined}
  >
    <div className={classnames(styles.trace, styles.size)}>
      <Logo size="100%" title="Loading Playroom Preview" />
    </div>
  </div>
);
