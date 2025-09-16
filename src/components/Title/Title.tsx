import { useContext } from 'react';

import { StoreContext } from '../../contexts/StoreContext';

import * as styles from './Title.css';

export const Title = () => {
  const [{ title }, dispatch] = useContext(StoreContext);

  return (
    <input
      type="text"
      id="playroomTitleField"
      placeholder="Untitled"
      className={styles.textField}
      value={title}
      onFocus={(event) => {
        event.currentTarget.select();
      }}
      onChange={(e) =>
        dispatch({
          type: 'updateTitle',
          payload: { title: e.target.value },
        })
      }
    />
  );
};
