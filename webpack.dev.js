const path = require("path");
const webpack = require("webpack");
const Dotenv = require("dotenv-webpack");

module.exports = {
  mode: "development",
  entry: path.resolve(__dirname, "./code/webcomp-events.js"),
  watch: true,
  output: {
    path: path.resolve(__dirname, "./work/scripts"),
    filename: "webcomp-events.js",
  },
  plugins: [new Dotenv()],
  // webpack-dev-server configuration
  devServer: {
    contentBase: path.resolve(__dirname, "./work"),
    publicPath: "/scripts/",
    watchContentBase: true,
    compress: true,
    port: 8080,
    open: true,
    openPage: "",
    overlay: true,
  },
  devtool: "inline-source-map",
  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              "@babel/plugin-syntax-class-properties",
              "@babel/plugin-proposal-class-properties",
            ],
          },
        },
      },
      {
        test: /\.(s*)css$/,
        use: ["css-loader", "sass-loader"],
      },
      {
        test: /\.svg/,
        use: {
          loader: "svg-url-loader",
          options: {},
        },
      },
      {
        test: /\.(png|jpg|gif|ttf)$/i,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 10000,
            },
          },
        ],
      },
    ],
  },
};
