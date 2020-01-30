interface Snippet {
  group: string;
  name: string;
  code: string;
}

type Snippets = Snippet[];

interface CreateUrlOptions {
  baseUrl?: string;
  code?: string;
  themes?: string[];
  widths?: number[];
}

export const createUrl: (options: CreateUrlOptions) => string;
