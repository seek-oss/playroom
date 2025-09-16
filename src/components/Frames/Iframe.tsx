import {
  useState,
  useEffect,
  useRef,
  type AllHTMLAttributes,
  type RefObject,
  forwardRef,
} from 'react';

import playroomConfig from '../../config';

interface IframeProps extends AllHTMLAttributes<HTMLIFrameElement> {
  src: string;
  intersectionRootRef: RefObject<Element | null>;
}

export default forwardRef<HTMLIFrameElement, IframeProps>(function Iframe(
  { intersectionRootRef, style, src, ...restProps },
  forwardedRef
) {
  const [loaded, setLoaded] = useState(false);
  const [renderedSrc, setRenderedSrc] = useState<string | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const intersection = useIntersection(iframeRef, {
    root: intersectionRootRef.current,
    rootMargin: '800px',
    threshold: 0,
  });

  const intersectionRatio = intersection?.intersectionRatio ?? null;

  useEffect(() => {
    if (intersectionRatio === null) {
      return;
    }

    if (intersectionRatio > 0 && src !== renderedSrc) {
      setRenderedSrc(src);
    }
  }, [intersectionRatio, src, renderedSrc]);

  useEffect(() => {
    if (renderedSrc !== null) {
      const location = iframeRef.current?.contentWindow?.location;

      if (location) {
        location.replace(renderedSrc);
      }
    }
  }, [renderedSrc]);

  return (
    <iframe
      ref={(el: HTMLIFrameElement | null) => {
        iframeRef.current = el;
        if (typeof forwardedRef === 'function') {
          forwardedRef(el);
        } else if (forwardedRef && 'current' in forwardedRef) {
          forwardedRef.current = el;
        }
      }}
      sandbox={playroomConfig.iframeSandbox}
      onLoad={() => setLoaded(true)}
      onMouseEnter={() => {
        if (src !== renderedSrc) {
          setRenderedSrc(src);
        }
      }}
      style={{
        ...style,
        opacity: loaded ? 1 : 0,
      }}
      {...restProps}
    />
  );
});

// copied directly from `react-use`
// https://github.com/streamich/react-use/blob/d2028ae44c79628475f0ef1736c4a48ca310247a/src/useIntersection.ts#L3-L28
function useIntersection(
  ref: RefObject<HTMLElement | null>,
  options: IntersectionObserverInit
): IntersectionObserverEntry | null {
  const [intersectionObserverEntry, setIntersectionObserverEntry] =
    useState<IntersectionObserverEntry | null>(null);

  useEffect(() => {
    if (ref.current && typeof IntersectionObserver === 'function') {
      const handler = (entries: IntersectionObserverEntry[]) => {
        setIntersectionObserverEntry(entries[0]);
      };

      const observer = new IntersectionObserver(handler, options);
      observer.observe(ref.current);

      return () => {
        setIntersectionObserverEntry(null);
        observer.disconnect();
      };
    }
    return () => {};
    // disabled in the original implementation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref.current, options.threshold, options.root, options.rootMargin]);

  return intersectionObserverEntry;
}
