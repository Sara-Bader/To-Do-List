const path = require('path');

module.exports = {
  entry: '.src/scripts/App.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, './src/scripts/App.css'),
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
      {
        test: /\.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
};
