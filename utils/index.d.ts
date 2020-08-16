interface Snippet {
  group: string;
  name: string;
  code: string;
}

type Snippets = Snippet[];

type ParamType = 'hash' | 'search';

interface CompressParamsOptions {
  code?: string;
  themes?: string[];
  widths?: number[];
  theme?: string;
}
export const compressParams: (options: CompressParamsOptions) => string;

interface CreateUrlOptions {
  baseUrl?: string;
  code?: string;
  themes?: string[];
  widths?: number[];
  paramType?: ParamType;
}

export const createUrl: (options: CreateUrlOptions) => string;

interface CreatePreviewUrlOptions {
  baseUrl?: string;
  code?: string;
  theme?: string;
  paramType?: ParamType;
}

export const createPreviewUrl: (options: CreatePreviewUrlOptions) => string;
