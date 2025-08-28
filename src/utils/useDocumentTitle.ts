import { useEffect } from 'react';

import playroomConfig from '../config';

interface UseDocumentTitleProps {
  title?: string;
  suffix?: string;
}

export function useDocumentTitle({ title, suffix }: UseDocumentTitleProps) {
  useEffect(() => {
    document.title = getTitle({ title, suffix });
  }, [title, suffix]);
}

function getTitle({
  title,
  suffix = 'Playroom',
}: UseDocumentTitleProps): string {
  const resolvedTitle = title || playroomConfig?.title;

  if (resolvedTitle) {
    return `${resolvedTitle} | ${suffix}`;
  }

  return suffix;
}
