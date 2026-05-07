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
  return null;
}

function getFiberKey(el: Element): string | undefined {
  return Object.keys(el).find((k) => k.startsWith('__reactFiber$'));
}

function isLineMarker(fiber: any): boolean {
  return fiber.type?.__playroomLineMarker === true;
}

function findHostElement(fiber: any): Element | null {
  let current = fiber.child;
  while (current) {
    if (current.stateNode instanceof Element) {
      return current.stateNode;
    }
    current = current.child;
  }
  return null;
}

interface InspectResult {
  line: number;
  element: Element;
}

function findInspectTarget(el: Element): InspectResult | null {
  const fiberKey = getFiberKey(el);
  if (!fiberKey) {
    return null;
  }

  let fiber = (el as any)[fiberKey];
  while (fiber) {
    if (isLineMarker(fiber)) {
      const line = fiber.memoizedProps.line;
      const element = findHostElement(fiber);
      if (element) {
        return { line, element };
      }
    }
    fiber = fiber.return;
  }

  return null;
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

    const target = findInspectTarget(el);
    if (!target) {
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

    setHighlightRect(getVisibleRect(target.element));

    if (target.line !== lastLineRef.current) {
      lastLineRef.current = target.line;
      window.parent.postMessage(
        { source: PlayroomInspectSource, type: 'hover', line: target.line },
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
      const target = findInspectTarget(el);
      if (target) {
        window.parent.postMessage(
          { source: PlayroomInspectSource, type: 'select', line: target.line },
          '*'
        );
      }
    }
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHighlightRect(null);
    if (lastLineRef.current !== null) {
      lastLineRef.current = null;
      window.parent.postMessage(
        { source: PlayroomInspectSource, type: 'hover', line: null },
        '*'
      );
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

  if (!enabled) {
    return null;
  }

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
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={0}
        autoFocus
      />
    </>
  );
};
