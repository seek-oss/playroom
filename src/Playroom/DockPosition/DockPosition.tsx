import React from 'react';
import EditorUndockedSvg from './icons/EditorUndockedSvg';
import EditorLeftSvg from './icons/EditorLeftSvg';
import EditorBottomSvg from './icons/EditorBottomSvg';
import EditorRightSvg from './icons/EditorRightSvg';
import { EditorPosition } from '../../StoreContext/StoreContext';

// @ts-ignore
import styles from './DockPosition.less';

interface DockPositionProps {
  position: EditorPosition;
  setPosition: (position: EditorPosition) => void;
}

export default ({ position, setPosition }: DockPositionProps) => {
  return (
    <div className={styles.root}>
      <div className={styles.container}>
        <div className={styles.currentPosition}>
          {
            {
              undocked: <EditorUndockedSvg />,
              left: <EditorLeftSvg />,
              right: <EditorRightSvg />,
              bottom: <EditorBottomSvg />
            }[position]
          }
        </div>
        <div className={styles.buttons}>
          {position !== 'undocked' && (
            <button
              title="Undock editor"
              className={styles.button}
              onClick={() => setPosition('undocked')}
            >
              <EditorUndockedSvg />
            </button>
          )}
          {position !== 'left' && (
            <button
              title="Dock editor to the left"
              className={styles.button}
              onClick={() => setPosition('left')}
            >
              <EditorLeftSvg />
            </button>
          )}
          {position !== 'right' && (
            <button
              title="Dock editor to the right"
              className={styles.button}
              onClick={() => setPosition('right')}
            >
              <EditorRightSvg />
            </button>
          )}
          {position !== 'bottom' && (
            <button
              title="Dock editor to the bottom"
              className={styles.button}
              onClick={() => setPosition('bottom')}
            >
              <EditorBottomSvg />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
