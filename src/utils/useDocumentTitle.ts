import { useEffect } from 'react';

interface UseDocumentTitleProps {
  title?: string;
  isPreview?: boolean;
}

export function useDocumentTitle({
  title,
  isPreview,
}: UseDocumentTitleProps): void {
  useEffect(() => {
    if (title !== undefined) {
      document.title = getTitle({ title, isPreview });
    }
  }, [title, isPreview]);
}

function getTitle({ title, isPreview }: UseDocumentTitleProps): string {
  const defaultTitle = isPreview ? 'Playroom Preview' : 'Playroom';
  const configTitle = window?.__playroomConfig__.title || defaultTitle;

  if (title) {
    return `${title} | ${defaultTitle}`;
  }

  return configTitle;
}
