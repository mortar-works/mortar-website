const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
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
        test: /\.scss$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
            use: [
              {loader: 'css-loader', options: { url: false }},
              {loader: 'sass-loader', options: {}}
            ]
          })
	  },
	  {
        test: /\.css$/,
        use: ExtractTextPlugin.extract(
          {
            fallback: 'style-loader',
			use: [
				{loader: 'css-loader', options: { url: false }}
			]
          })
      }
    ]
  },
  plugins: [
    new ExtractTextPlugin({
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
