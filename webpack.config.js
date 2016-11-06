const path = require('path');
const webpack = require('webpack');

const env = process.env;
const isProd = env.NODE_ENV === 'production';

const entry = isProd ?  './src/Editro.js' : [
  'webpack-dev-server/client?http://localhost:4001',
  'webpack/hot/only-dev-server',
  './dev/index'
];

const output = {
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
  publicPath: '/static/'
};

//if (isProd) {
  //output.path = path.join(__dirname, 'lib');
  //output.library = 'editro';
  //output.libraryTarget = 'umd';
  //output.filename = 'editro.js';
//}

const include = [
  path.join(__dirname, 'src'),
  path.join(__dirname, 'examples')
];

const config = {
  devtool: isProd ? null : 'eval',
  entry,
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
        test: /\.css$/,
        loaders: ['style-loader', 'css-loader'],
        include: [
          path.join(__dirname, 'node_modules/codemirror/'),
          path.join(__dirname, 'node_modules/mocha/')
        ]
      },
      //{
        //test: /\.html/,
        //loaders: ['html-loader'],
        //include: include
      //},
      {
        test: /\.(svg|png|jpg)$/,
        loader: 'url-loader?limit=8192',
        include: [ path.join(__dirname, 'images') ]
      }
    ]
  },
  resolve: {
    alias: {
      mocha$: path.join(__dirname, 'node_modules/mocha/mocha.js'),
      'mocha.css$': path.join(__dirname, 'node_modules/mocha/mocha.css'),
    }
  },
  plugins: [
    isProd ? null : new webpack.HotModuleReplacementPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(env.NODE_ENV || 'development')
    })
  ].filter(a => a)
};

module.exports = config
