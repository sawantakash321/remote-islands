const path = require('path');
const chalk = require('chalk');
const webpack = require('webpack');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const FontelloPlugin = require('fontello-webpack-plugin');

const PRODUCTION = process.env.NODE_ENV === 'production';
const DEVELOPMENT = process.env.NODE_ENV === 'development';

if (PRODUCTION) {
  console.log(chalk.red('Now entering production.'));
} else {
  console.log(chalk.red('Now entering development.'));
}

const plugins = PRODUCTION
  ? [
      // Plugins used only in production.
      new ExtractTextPlugin('styles.css'),
      new CopyWebpackPlugin([
        {
          from: './src/img/misc/loading.gif',
          to: './img/misc'
        },
        {
          from: './src/img/overlays',
          to: './img/overlays'
        }
      ])
    ]
  : [
      // Plugins used only in development.
      new webpack.NamedModulesPlugin()
    ];

// Plugins used in both production and development.
plugins.push(
  new FontelloPlugin({
    config: require('./fontello.config.json') // eslint-disable-line global-require
  }),
  new webpack.DefinePlugin({
    DEVELOPMENT: JSON.stringify(DEVELOPMENT),
    PRODUCTION: JSON.stringify(PRODUCTION)
  }),
  new HTMLWebpackPlugin({
    template: path.join(__dirname, 'src', 'index.html'),
    hash: true
  })
);

const cssProduction = ExtractTextPlugin.extract({
  fallback: 'style-loader',
  use: [
    {
      loader: 'css-loader',
      options: {
        import: false,
        importLoaders: 1,
        minimize: false,
        sourceMap: true,
        url: false
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true
      }
    }
  ]
});

const cssDevelopment = [
  {
    loader: 'style-loader',
    options: {
      sourceMap: true
    }
  },
  {
    loader: 'css-loader',
    options: {
      import: false,
      importLoaders: 1,
      minimize: false,
      sourceMap: true,
      url: false
    }
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: 'inline'
    }
  }
];

module.exports = {
  entry: './src/js/app.js',
  output: {
    path: path.resolve(__dirname, 'build'),
    filename: 'bundle.js'
  },
  devtool: PRODUCTION ? 'source-map' : 'inline-source-map',
  devServer: {
    compress: true,
    clientLogLevel: 'error',
    overlay: {
      warnings: false,
      errors: true
    }
  },
  plugins,
  module: {
    rules: [
      {
        test: /\.js$/,
        include: path.join(__dirname, 'src', 'js'),
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              ['env', { modules: false }] // 'modules: false' enables Webpack tree shaking.
            ]
          }
        }
      },
      {
        test: /\.css$/,
        use: PRODUCTION ? cssProduction : cssDevelopment
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 15000,
              name: '[name].[ext]',
              outputPath: 'img/clouds/'
            }
          },
          {
            loader: 'image-webpack-loader',
            query: {
              pngquant: {
                quality: '5-25'
              }
            }
          }
        ]
      },
      {
        test: /\.(ogg|mp3)$/,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'sounds/'
          }
        }
      },
      {
        test: /\.html$/,
        use: 'raw-loader'
      }
    ]
  }
};
