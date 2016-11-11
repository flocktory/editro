const path = require('path');
const webpack = require('webpack');

const env = process.env;

const output = {};
output.path = path.join(__dirname, 'lib');
output.library = 'editro';
output.libraryTarget = 'umd';
output.filename = 'editro.js';

const include = [
  path.join(__dirname, 'src'),
];

const config = {
  devtool: false,
  entry: './src/normalBuild.js',
  output: output,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: [],
        include: include
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: [ path.join(__dirname, 'scss') ]
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'url-loader',
        include: [ path.join(__dirname, 'images') ]
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development')
    })
  ].filter(a => a)
};

module.exports = config;
