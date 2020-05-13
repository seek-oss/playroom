import React, {
  useState,
  useEffect,
  useRef,
  AllHTMLAttributes,
  MutableRefObject,
} from 'react';
import { useIntersection } from 'react-use';

interface IframeProps extends AllHTMLAttributes<HTMLIFrameElement> {
  src: string;
  intersectionRootRef: MutableRefObject<Element | null>;
}

const playroomConfig = (window.__playroomConfig__ = __PLAYROOM_GLOBAL__CONFIG__);

export default function Iframe({
  intersectionRootRef,
  style,
  src,
  ...restProps
}: IframeProps) {
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
      ref={iframeRef}
      sandbox={playroomConfig.iframeSandbox ?? "allow-scripts"}
      onLoad={() => setLoaded(true)}
      onMouseEnter={() => {
        if (src !== renderedSrc) {
          setRenderedSrc(src);
        }
      }}
      style={{
        ...style,
        transition: 'opacity .3s ease',
        opacity: loaded ? 1 : 0,
      }}
      {...restProps}
    />
  );
}
