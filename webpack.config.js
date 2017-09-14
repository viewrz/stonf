/* eslint-disable import/no-commonjs */
const yaml = require('js-yaml');
const path = require('path');
const fs = require('fs');
const nodeExternals = require('webpack-node-externals');

const slsConf = yaml.safeLoad(fs.readFileSync(path.join(__dirname, 'serverless.yml')));
const remoteNodeVersion = slsConf.provider.runtime.replace('nodejs', '');

module.exports = {
  entry: './handler.js',
  target: 'node',
  externals: [nodeExternals()],
  module: {
    rules: [
      {
        test: /\.graphql$/,
        use: 'raw-loader',
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              [
                'env',
                {
                  targets: { node: remoteNodeVersion },
                },
              ],
            ],
          },
        },
      },
    ],
  },
};
