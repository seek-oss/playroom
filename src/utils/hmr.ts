type AcceptHandler = (relativePath: string, handler: () => void) => void;

export function hmrAccept(handler: (accept: AcceptHandler) => void) {
  // @ts-ignore
  const viteAccept = import.meta.hot?.accept;

  if (
    typeof module !== 'undefined' &&
    // @ts-ignore
    typeof module?.hot?.accept === 'function'
  ) {
    // @ts-ignore
    handler(module.hot.accept);
  } else if (typeof viteAccept === 'function') {
    handler(viteAccept);
  }
}
