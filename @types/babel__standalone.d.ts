interface TransformResponse {
  code: string;
}

declare module '@babel/standalone' {
  import { TransformOptions } from '@babel/core';

  function transform(
    code: string,
    options: TransformOptions
  ): TransformResponse;
}
