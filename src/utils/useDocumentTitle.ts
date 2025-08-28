import { useEffect } from 'react';

export function useDocumentTitle(newTitle?: string): void {
  useEffect(() => {
    if (newTitle !== undefined) {
      document.title = newTitle;
    }
  }, [newTitle]);
}
