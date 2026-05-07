import { useCallback, useEffect, useRef, useState } from 'react';

import { PlayroomInspectSource } from './frameMessenger';

import * as styles from './InspectOverlay.css';

const INSPECT_LINE_KEY = 'data-playroom-line';

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

function getPropsKey(el: Element): string | undefined {
  return Object.keys(el).find((k) => k.startsWith('__reactProps$'));
}

function getFiberKey(el: Element): string | undefined {
  return Object.keys(el).find((k) => k.startsWith('__reactFiber$'));
}

interface InspectResult {
  line: number;
  element: Element;
}

function findInspectTarget(el: Element): InspectResult | null {
  // Check __reactProps$ on the hovered DOM element
  const propsKey = getPropsKey(el);
  if (propsKey) {
    const props = (el as any)[propsKey];
    if (props?.[INSPECT_LINE_KEY] != null) {
      return { line: Number(props[INSPECT_LINE_KEY]), element: el };
    }
  }

  // Walk up DOM tree
  let child: Element = el;
  let current: Element | null = el.parentElement;
  while (current) {
    const pk = getPropsKey(current);
    if (pk) {
      const props = (current as any)[pk];
      // Check children for component boundaries matching our hovered subtree
      const childLine = findLineForChild(props?.children, child, current);
      if (childLine != null) {
        return { line: childLine, element: child };
      }
      if (props?.[INSPECT_LINE_KEY] != null) {
        return { line: Number(props[INSPECT_LINE_KEY]), element: current };
      }
    }
    child = current;
    current = current.parentElement;
  }

  return null;
}

function findLineForChild(
  children: any,
  child: Element,
  parent: Element
): number | null {
  if (!children) return null;

  const flatChildren = flattenChildren(children);
  const fiberKey = getFiberKey(child);
  if (!fiberKey) return null;

  let fiber = (child as any)[fiberKey];
  while (fiber) {
    if (fiber.stateNode === parent) break;

    if (typeof fiber.type === 'function' || typeof fiber.type === 'object') {
      for (const reactChild of flatChildren) {
        if (!reactChild || typeof reactChild !== 'object') continue;
        if (
          reactChild.type === fiber.type &&
          reactChild.props?.[INSPECT_LINE_KEY] != null
        ) {
          return Number(reactChild.props[INSPECT_LINE_KEY]);
        }
      }
    }
    fiber = fiber.return;
  }

  return null;
}

function flattenChildren(children: any): any[] {
  if (!children) return [];
  const arr = Array.isArray(children) ? children : [children];
  const result: any[] = [];
  for (const child of arr) {
    if (!child || typeof child !== 'object') continue;
    if (
      child.type === Symbol.for('react.fragment') ||
      child.type === Symbol.for('react.transitional.element')
    ) {
      result.push(...flattenChildren(child.props?.children));
    } else {
      result.push(child);
    }
  }
  return result;
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
