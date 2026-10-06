import { clsx } from 'clsx';
import { useContext } from 'react';

import { StoreContext } from '../../contexts/StoreContext';

import * as styles from './Title.css';

export const Title = () => {
  const [{ title }, dispatch] = useContext(StoreContext);

  return (
    <div className={styles.fieldContainer}>
      <input
        type="text"
        aria-label="Playroom Title"
        placeholder="Untitled"
        className={styles.textField}
        value={title || ''}
        onFocus={(event) => event.currentTarget.focus()}
        onChange={(e) =>
          dispatch({
            type: 'updateTitle',
            payload: { title: e.target.value },
          })
        }
      />
      <span
        aria-hidden
        className={clsx({
          [styles.readOnlyText]: true,
          [styles.noTitle]: !title,
        })}
      >
        {title || 'Untitled'}
      </span>
    </div>
  );
};
