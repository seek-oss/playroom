import { useContext, useEffect, useRef } from 'react';

import { StoreContext } from '../../contexts/StoreContext';
import { Text } from '../Text/Text';

import * as styles from './EditorErrorMessage.css';

const duration = 3000;

export const EditorErrorMessage = () => {
  const [{ editorErrorMessage }, dispatch] = useContext(StoreContext);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }

    if (editorErrorMessage) {
      timerRef.current = setTimeout(() => {
        dispatch({ type: 'resetErrorMessage' });
      }, duration);
    }
  }, [dispatch, editorErrorMessage]);

  if (!editorErrorMessage) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Text>{editorErrorMessage}</Text>
    </div>
  );
};
