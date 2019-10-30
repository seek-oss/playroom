interface CreateUrlOptions {
  baseUrl?: string;
  code: string;
}

export const createUrl: (options: CreateUrlOptions) => string;
