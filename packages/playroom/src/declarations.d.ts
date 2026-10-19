declare module '*.png';

declare module '@soda/friendly-errors-webpack-plugin' {
  import type { Compiler, WebpackPluginInstance } from 'webpack';

  export default class FriendlyErrorsWebpackPlugin implements WebpackPluginInstance {
    apply(compiler: Compiler): void;
  }
}
