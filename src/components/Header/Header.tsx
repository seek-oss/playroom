import { Box } from '../Box/Box';
import { Logo } from '../Logo/Logo';

import * as styles from './Header.css';

export const Header = () => (
  <Box className={styles.root}>
    <Logo size={24} />
  </Box>
);
