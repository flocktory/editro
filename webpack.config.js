const path = require('path');
const webpack = require('webpack');

const env = process.env;
const isProd = env.NODE_ENV === 'production';

const entry = isProd ?
  './src/Editro.js' :
  [
    'webpack-dev-server/client?http://localhost:4001',
    'webpack/hot/only-dev-server',
    './src/index'
  ];

const output = {
  path: path.join(__dirname, isProd ? 'lib' : 'dist'),
  filename: 'bundle.js',
  publicPath: '/static/'
};

if (isProd) {
  output.library = 'editro';
  output.libraryTarget = 'umd';
  output.filename = 'editro.js';
}

module.exports = {
  devtool: isProd ? null : 'eval',
  entry: entry,
  output: output,
  module: {
    loaders: [
      {
        test: /\.js$/,
        loaders: ['babel'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.scss$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: path.join(__dirname, 'node_modules/codemirror/')
      },
      {
        test: /\.html/,
        loaders: ['html-loader'],
        include: path.join(__dirname, 'src')
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'url-loader?limit=8192'
      }
    ]
  },
  plugins: [
    isProd ? null : new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development'),
      'process.env.KEY_MAP': JSON.stringify(env.KEY_MAP || 'default')
    })
  ].filter(a => a)
};
