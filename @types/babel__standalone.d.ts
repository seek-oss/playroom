interface TransformResponse {
  code: string;
}

declare module '@babel/standalone' {
  import type { TransformOptions } from '@babel/core';

  function transform(
    code: string,
    options: TransformOptions
  ): TransformResponse;
}
