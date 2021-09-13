module.exports = (playroomConfig) => ({
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        include: playroomConfig.cwd,
        exclude: /node_modules/,
        use: [
          {
            loader: require.resolve('babel-loader'),
            options: {
              presets: [
                require.resolve('@babel/preset-env'),
                require.resolve('@babel/preset-react'),
              ],
            },
          },
        ],
      },
    ],
  },
});
