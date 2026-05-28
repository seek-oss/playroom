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

function getLineFromFiber(fiber: any): number | null {
  const props = fiber.memoizedProps;
  const line =
    typeof fiber.type === 'string'
      ? props?.['data-playroomline']
      : props?.__playroomLine;
  return typeof line === 'number' ? line : null;
}

function findHostElement(fiber: any): Element | null {
  if (fiber.stateNode instanceof Element) {
    return fiber.stateNode;
  }
  let current = fiber.child;
  while (current) {
    if (current.stateNode instanceof Element) {
      return current.stateNode;
    }
    const found = findHostElement(current);
    if (found) {
      return found;
    }
    current = current.sibling;
  }
  return null;
}

interface InspectResult {
  line: number;
  element: Element;
}

interface ElementMatch {
  type: any;
  line: number;
}

function findDeepestElementMatch(
  element: any,
  fiberTypes: Set<any>
): ElementMatch | null {
  if (!element || typeof element !== 'object') {
    return null;
  }

  let best: ElementMatch | null = null;

  if (element.props?.__playroomLine != null && fiberTypes.has(element.type)) {
    best = { type: element.type, line: element.props.__playroomLine };
  }

  const children = element.props?.children;
  if (children) {
    const childArr = Array.isArray(children) ? children : [children];
    for (const child of childArr) {
      const deeper = findDeepestElementMatch(child, fiberTypes);
      if (deeper) {
        best = deeper;
      }
    }
  }

  return best;
}

function findInspectTarget(el: Element): InspectResult | null {
  const fiberKey = getFiberKey(el);
  if (!fiberKey) {
    return null;
  }

  const fiberPath: any[] = [];
  let fiber = (el as any)[fiberKey];

  while (fiber) {
    fiberPath.push(fiber);

    const line = getLineFromFiber(fiber);
    if (line !== null) {
      const fiberTypes = new Set(fiberPath.map((f) => f.type));
      const childrenElement = fiber.memoizedProps?.children;
      const deeperMatch = findDeepestElementMatch(childrenElement, fiberTypes);

      if (deeperMatch) {
        const targetFiber = fiberPath.find((f) => f.type === deeperMatch.type);
        if (targetFiber) {
          const hostEl = findHostElement(targetFiber);
          if (hostEl) {
            return { line: deeperMatch.line, element: hostEl };
          }
        }
      }

      const hostEl = findHostElement(fiber);
      if (hostEl) {
        return { line, element: hostEl };
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
