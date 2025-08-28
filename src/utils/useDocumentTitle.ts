import { useEffect } from 'react';

export function useDocumentTitle(newTitle?: string): void {
  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    if (newTitle !== undefined) {
      document.title = newTitle;
    }
  }, [newTitle]);
}
