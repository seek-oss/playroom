import { useState, type RefObject } from 'react';

import { Box } from '../Box/Box';

import * as styles from './ResizeHandle.css';

type NativeTouchOrMouseMove = Parameters<
  typeof window.addEventListener<'mousemove' | 'touchmove'>
>[1];

const resolvePosition = (
  event: MouseEvent | TouchEvent,
  pagePos: 'pageX' | 'pageY'
) => {
  let position = 0;

  if ('touches' in event && event.touches.length > 0) {
    position = event.touches[0][pagePos];
  } else if ('pageX' in event) {
    position = event[pagePos];
  }

  return position;
};

export const ResizeHandle = ({
  position,
  ref,
  onResize,
  onResizeStart,
  onResizeEnd,
}: {
  position: 'top' | 'right' | 'left';
  flip?: boolean;
  ref: RefObject<HTMLElement | null>;
  onResize: (newValue: number) => void;
  onResizeStart?: (startValue: number) => void;
  onResizeEnd?: (endValue: number) => void;
}) => {
  const [resizing, setResizing] = useState(false);
  const isVertical = position !== 'top';
  const modifier = position === 'right' ? -1 : 1;
  const direction = isVertical ? 'vertical' : 'horizontal';
  const pagePos = isVertical ? 'pageX' : 'pageY';
  const elementSize = isVertical ? 'offsetWidth' : 'offsetHeight';

  const startHandler = (
    event: React.MouseEvent<HTMLElement> | React.TouchEvent<HTMLElement>
  ) => {
    const startPosition = resolvePosition(event.nativeEvent, pagePos);
    const startSize = ref.current?.[elementSize] ?? 0;

    setResizing(true);
    onResizeStart?.(startSize);
    document.body.classList.add(styles.resizeCursor[direction]);

    const moveHandler: NativeTouchOrMouseMove = (moveEvent) => {
      const movePosition = resolvePosition(moveEvent, pagePos);
      const delta = movePosition - startPosition;
      onResize(startSize - delta * modifier);
    };

    const stopHandler = () => {
      const endSize = ref.current?.[elementSize] ?? 0;
      setResizing(false);
      onResizeEnd?.(endSize);
      document.body.classList.remove(styles.resizeCursor[direction]);

      window.removeEventListener('mousemove', moveHandler);
      window.removeEventListener('touchmove', moveHandler);
      window.removeEventListener('mouseup', stopHandler);
      window.removeEventListener('touchend', stopHandler);
    };

    window.addEventListener('mousemove', moveHandler);
    window.addEventListener('touchmove', moveHandler);
    window.addEventListener('mouseup', stopHandler);
    window.addEventListener('touchend', stopHandler);
  };

  return (
    <Box
      onTouchStart={startHandler}
      onMouseDown={(event) => {
        // Only initiate resize on left click
        if (event.button === 0) {
          startHandler(event);
        }
      }}
      className={{
        [styles.resizeContainer[direction]]: true,
        [styles.right]: position === 'right',
        [styles.left]: position === 'left',
        [styles.resizing]: resizing,
      }}
    >
      <Box className={styles.handle[direction]} />
    </Box>
  );
};
