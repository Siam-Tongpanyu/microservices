const path = require('path');
const webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',
  entry: [
    './src/index',
  ],
  output: {
    path: path.join(__dirname, 'dist'),
    filename: 'bundle.js',
  },
  plugins: [
    new webpack.NamedModulesPlugin(),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
  module: {
    rules: [
      {
        test: /\.js?$/,
        use: [ 'babel-loader' ],
        include: path.join(__dirname, 'src'),
      },
    ],
  },
  target: 'node',
  node: {
    dns: 'empty',
    fs: 'empty',
    module: 'empty',
    tls: 'empty',
    net: 'empty'
  }
};