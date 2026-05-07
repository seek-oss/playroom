import { useCallback, useEffect, useRef, useState } from 'react';

import { PlayroomInspectSource } from './frameMessenger';

import * as styles from './InspectOverlay.css';

interface HighlightRect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function getVisibleRect(el: Element): HighlightRect | null {
  const rect = el.getBoundingClientRect();
  if (rect.width > 0 && rect.height > 0) {
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  }
  // For display:contents elements, compute bounding box from children
  const children = el.children;
  if (children.length === 0) {
    return null;
  }

  let top = Infinity;
  let left = Infinity;
  let bottom = -Infinity;
  let right = -Infinity;

  for (const child of Array.from(children)) {
    const childRect = child.getBoundingClientRect();
    if (childRect.width === 0 && childRect.height === 0) continue;
    top = Math.min(top, childRect.top);
    left = Math.min(left, childRect.left);
    bottom = Math.max(bottom, childRect.bottom);
    right = Math.max(right, childRect.right);
  }

  if (top === Infinity) {
    return null;
  }
  return { top, left, width: right - left, height: bottom - top };
}

export const InspectOverlay = () => {
  const [enabled, setEnabled] = useState(false);
  const [highlightRect, setHighlightRect] = useState<HighlightRect | null>(
    null
  );
  const lastLineRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.source !== PlayroomInspectSource) {
        return;
      }

      if (event.data.action === 'enable') {
        setEnabled(true);
      } else if (event.data.action === 'disable') {
        setEnabled(false);
        setHighlightRect(null);
        lastLineRef.current = null;
      }
    };

    const handleScroll = () => {
      setHighlightRect(null);
    };

    window.addEventListener('message', handleMessage);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      window.removeEventListener('message', handleMessage);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, []);

  // Fallback: detect when annotated elements appear in the DOM
  useEffect(() => {
    if (enabled) {
      return;
    }

    const observer = new MutationObserver(() => {
      if (document.querySelector('[data-playroom-line]')) {
        setEnabled(true);
        observer.disconnect();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['data-playroom-line'],
    });

    return () => observer.disconnect();
  }, [enabled]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const overlay = e.currentTarget as HTMLElement;
    overlay.style.pointerEvents = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    overlay.style.pointerEvents = '';

    if (!el) {
      setHighlightRect(null);
      if (lastLineRef.current !== null) {
        lastLineRef.current = null;
        window.parent.postMessage(
          { source: PlayroomInspectSource, type: 'hover', line: null },
          '*'
        );
      }
      return;
    }

    const annotated = el.closest('[data-playroom-line]');
    if (!annotated) {
      setHighlightRect(null);
      if (lastLineRef.current !== null) {
        lastLineRef.current = null;
        window.parent.postMessage(
          { source: PlayroomInspectSource, type: 'hover', line: null },
          '*'
        );
      }
      return;
    }

    const visibleRect = getVisibleRect(annotated);
    setHighlightRect(visibleRect);

    const line = Number(annotated.getAttribute('data-playroom-line'));
    if (line !== lastLineRef.current) {
      lastLineRef.current = line;
      window.parent.postMessage(
        { source: PlayroomInspectSource, type: 'hover', line },
        '*'
      );
    }
  }, []);

  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const overlay = e.currentTarget as HTMLElement;
    overlay.style.pointerEvents = 'none';
    const el = document.elementFromPoint(e.clientX, e.clientY);
    overlay.style.pointerEvents = '';

    if (el) {
      const annotated = el.closest('[data-playroom-line]');
      if (annotated) {
        const line = Number(annotated.getAttribute('data-playroom-line'));
        window.parent.postMessage(
          { source: PlayroomInspectSource, type: 'select', line },
          '*'
        );
      }
    }
  }, []);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      window.parent.postMessage(
        { source: PlayroomInspectSource, type: 'exit' },
        '*'
      );
    }
  }, []);

  if (!enabled) return null;

  return (
    <>
      {highlightRect && (
        <div
          className={styles.highlight}
          style={{
            top: highlightRect.top,
            left: highlightRect.left,
            width: highlightRect.width,
            height: highlightRect.height,
          }}
        />
      )}
      <div
        className={styles.overlay}
        onMouseMove={handleMouseMove}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        autoFocus
      />
    </>
  );
};
