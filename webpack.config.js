const path = require('path');
const webpack = require('webpack');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

const isProd = process.env.NODE_ENV === 'production';
const isDev = !isProd;

const config = {
  entry: [
    isProd && './src/normalBuild.js',
    isDev && 'webpack-dev-server/client?http://localhost:4001',
    isDev && 'webpack/hot/only-dev-server',
    './dev/index'
  ].filter(Boolean),

  output: {
    path: path.join(__dirname, isProd ? 'lib' : 'dist'),
    filename: `${isProd ? 'editro' : 'bundle'}.js`,
    publicPath: '/static/',
    library: isProd ? 'editro' : undefined,
    libraryTarget: isProd ? 'amd' : undefined,
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        loaders: [],
        include: [
          path.join(__dirname, 'src'),
          path.join(__dirname, 'examples')
        ]
      },
      {
        test: /\.scss$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {loader: 'sass-loader'}
        ],
        include: path.join(__dirname, 'scss')
      },
      {
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: [
          path.join(__dirname, 'node_modules/mocha/'),
          path.join(__dirname, 'node_modules/monaco-editor/')
        ]
      },
      {
        test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
        loader: 'url-loader',
        include: path.join(__dirname, 'node_modules/monaco-editor/')
      },
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'url-loader',
        include: path.join(__dirname, 'images')
      },
      {
        test: /\.js$/,
        loader: 'babel-loader?extends=' + path.resolve('./.babelrc'),
        include: path.join(__dirname, 'node_modules/monaco-editor/')
      }
    ]
  },

  resolve: {
    alias: {
      mocha$: path.join(__dirname, 'node_modules/mocha/mocha.js'),
      'mocha.css$': path.join(__dirname, 'node_modules/mocha/mocha.css'),
      'monaco-editor': path.join(__dirname, 'node_modules/monaco-editor/esm/vs/editor/editor.api.js')
    }
  },

  plugins: [
    isDev && new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development')
    }),
    new MonacoWebpackPlugin({
      languages: ['html'],
      features: [
        '!accessibilityHelp',
        '!clipboard',
        '!fontZoom',
        '!colorDetector',
        '!dnd',
        '!iPadShowKeyboard',
        '!parameterHints',
        '!toggleHighContrast',
        '!toggleTabFocusMode'
      ]
    })
  ].filter(Boolean)
};

module.exports = config;
