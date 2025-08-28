import { useEffect, useState, type ReactNode } from 'react';

import { useDocumentTitle } from '../../utils/useDocumentTitle';
import { Box } from '../Box/Box';

import SplashScreen from './SplashScreen/SplashScreen';

import * as stylesheet from './SplashScreen/SplashScreen.css';

const { animationDuration, animationDelay, animationIterationCount } =
  stylesheet;

interface PreviewProps {
  title?: string;
  children?: ReactNode;
}
export default ({ title, children }: PreviewProps) => {
  const [loading, setLoading] = useState(true);

  useDocumentTitle({ title, isPreview: true });

  useEffect(() => {
    const hideSplash = setTimeout(
      () => setLoading(false),
      animationDelay + animationDuration * animationIterationCount
    );

    return () => clearTimeout(hideSplash);
  }, []);

  return (
    <>
      <Box position="relative" zIndex={0} aria-hidden={loading || undefined}>
        {children}
      </Box>
      <SplashScreen hide={!loading} />
    </>
  );
};
