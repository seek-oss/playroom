type AcceptHandler = (relativePath: string, handler: () => void) => void;

export function hmrAccept(handler: (accept: AcceptHandler) => void) {
  if (
    typeof module !== 'undefined' &&
    typeof module?.hot?.accept === 'function'
  ) {
    handler(module.hot.accept);
  }
}
