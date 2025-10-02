import clsx from 'clsx';
import { type ReactNode, useRef, useCallback, useLayoutEffect } from 'react';
import { useThrottledCallback } from 'use-debounce';

import * as styles from './ScrollContainer.css';

const scrollOffset = 2; // 2 instead of 1 to account for rounding errors in some browsers

const maskOverflow = (
  element: HTMLElement,
  direction: keyof typeof styles.direction
) =>
  setTimeout(() => {
    const atTop = element.scrollTop <= 0;
    const atBottom =
      element.scrollHeight - element.offsetHeight - element.scrollTop <
      scrollOffset;
    const atLeft = element.scrollLeft <= 0;
    const atRight =
      element.scrollWidth - element.offsetWidth - element.scrollLeft <
      scrollOffset;

    if (direction === 'vertical' || direction === 'all') {
      element.classList[atTop ? 'remove' : 'add'](styles.maskTop);
      element.classList[atBottom ? 'remove' : 'add'](styles.maskBottom);
    }
    if (direction === 'horizontal' || direction === 'all') {
      element.classList[atLeft ? 'remove' : 'add'](styles.maskLeft);
      element.classList[atRight ? 'remove' : 'add'](styles.maskRight);
    }
  });

interface ScrollContainerProps {
  children: ReactNode;
  direction?: keyof typeof styles.direction;
  fadeSize?: keyof typeof styles.fadeSize;
  hideScrollbar?: boolean;
}

export const ScrollContainer = ({
  children,
  direction = 'horizontal',
  fadeSize = 'medium',
  hideScrollbar = false,
}: ScrollContainerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // This must be called within a `useLayoutEffect` because `.scrollLeft`, `.scrollWidth` and `.offsetWidth` force a reflow
  // https://gist.github.com/paulirish/5d52fb081b3570c81e3a
  const updateMask = useThrottledCallback(
    useCallback(() => {
      if (containerRef.current) {
        maskOverflow(containerRef.current, direction);
      }
    }, [containerRef, direction]),
    100
  );

  useLayoutEffect(() => {
    if (containerRef.current) {
      updateMask();
    }

    window.addEventListener('resize', updateMask);
    return () => window.removeEventListener('resize', updateMask);
  }, [updateMask]);

  return (
    <div
      ref={containerRef}
      onScroll={updateMask}
      className={clsx([
        styles.container,
        styles.mask,
        hideScrollbar ? styles.hideScrollbar : null,
        styles.fadeSize[fadeSize],
        styles.direction[direction],
      ])}
    >
      {children}
    </div>
  );
};
