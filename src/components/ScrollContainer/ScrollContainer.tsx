import clsx from 'clsx';
import {
  type ReactNode,
  useRef,
  useCallback,
  useLayoutEffect,
  forwardRef,
  useImperativeHandle,
  type ForwardedRef,
  type RefObject,
} from 'react';
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

function useNormalizedRef<TElement>(
  externalRef: ForwardedRef<TElement>
): RefObject<TElement | null> {
  const internalRef = useRef<TElement | null>(null);

  useImperativeHandle<TElement | null, TElement | null>(
    externalRef,
    () => internalRef.current,
    []
  );

  return internalRef;
}

export const ScrollContainer = forwardRef<HTMLDivElement, ScrollContainerProps>(
  (
    {
      children,
      direction = 'horizontal',
      fadeSize = 'medium',
      hideScrollbar = false,
    },
    ref
  ) => {
    const fallbackRef = useRef<HTMLDivElement>(null);
    const containerRef = useNormalizedRef(ref || fallbackRef);

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
    }, [containerRef, updateMask]);

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
  }
);
