const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = {
  mode: 'none',
  entry: { main: './src/js/index.js' },
  output: {
    path: path.resolve(__dirname, 'src/site/static/js'),
    filename: 'main.js'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: /(.scss|.css)$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader', // translates CSS into CommonJS
            options: {
              url: false
            },
          },
          {
            loader: 'sass-loader', // compiles Sass to CSS
            options: {
              sassOptions: {
                outputStyle: 'compressed'
              }
            },
          },
        ],
	  }
    ]
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '../css/styles.css'
    }),
    new OptimizeCssAssetsPlugin({
      cssProcessor: require('cssnano'),
      cssProcessorPluginOptions: {
        preset: ['default', {
          discardComments: { removeAll: true }
        }],
      }
    })
  ]
};
