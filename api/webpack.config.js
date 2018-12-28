const webpack = require('webpack');
const slsw = require('serverless-webpack');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: slsw.lib.entries,
  target: 'node',
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  optimization: {
    minimize: false,
  },
  performance: {
    hints: false,
  },
  devtool: 'nosources-source-map',
  externals: [nodeExternals()],
  resolve: {
    extensions: [ '.js', '.json', '.ts', '.tsx' ],
  },
  plugins: [
    new webpack.IgnorePlugin(/^pg-native$/),
    new webpack.EnvironmentPlugin([
      'LEGACY_DB_USER',
      'LEGACY_DB_HOST',
      'LEGACY_DB_DATABASE',
      'LEGACY_DB_PASSWORD',
      'LEGACY_DB_PORT',
      'RDS_DB_USER',
      'RDS_DB_HOST',
      'RDS_DB_DATABASE',
      'RDS_DB_PASSWORD',
      'RDS_DB_PORT',
    ]),
  ],
  module: {
    rules: [
      {
        test: /\.(tsx?)|(js)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
    ],
  },
};
