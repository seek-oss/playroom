import type { Editor } from 'codemirror';

export type Direction = 'up' | 'down';

export type Selection = Parameters<Editor['setSelections']>[0][number];
