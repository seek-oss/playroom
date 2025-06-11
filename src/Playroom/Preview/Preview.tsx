import type { ReactNode } from 'react';
import { Helmet } from 'react-helmet';

import SplashScreen from './SplashScreen/SplashScreen';

import * as styles from './Preview.css';

interface PreviewProps {
  title?: string;
  children?: ReactNode;
}
export default ({ title, children }: PreviewProps) => (
  <>
    <Helmet>
      <title>
        {title ? `${title} | Playroom Preview` : 'Playroom Preview'}
      </title>
    </Helmet>
    <div className={styles.renderContainer}>{children}</div>
    <div className={styles.splashScreenContainer}>
      <SplashScreen />
    </div>
  </>
);
