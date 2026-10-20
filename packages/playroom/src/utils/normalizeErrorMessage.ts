const isError = (e: unknown): e is Error => e instanceof Error;

export const normalizeErrorMessage = (e: unknown): string =>
  isError(e) ? e.message : String(e);
