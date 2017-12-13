const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

var nodeModules = {};
fs.readdirSync('node_modules')
  .filter(function(x) {
    return ['.bin'].indexOf(x) === -1;
  })
  .forEach(function(mod) {
    nodeModules[mod] = 'commonjs ' + mod;
  });

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'heimdall-server.bundle.js'
  },
  target: "node",
  externals: nodeModules,
  module: {
    rules: [
      {
        test: /\.js$/, //Check for all js files
        loader: 'babel-loader',
        query: {
          presets: [ "babel-preset-es2015" ].map(require.resolve)
        }
      }
    ]
  }
}