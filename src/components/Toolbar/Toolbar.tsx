import clsx from 'clsx';

import * as styles from './Toolbar.css';

export default () => (
  <div
    className={clsx(styles.root, {
      [styles.isOpen]: false,
    })}
  >
    <div className={styles.sidebar} />
  </div>
);
