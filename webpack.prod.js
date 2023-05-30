// SPDX-FileCopyrightText: 2021 NOI Techpark <digital@noi.bz.it>
//
// SPDX-License-Identifier: CC0-1.0

const path = require("path");
const webpack = require("webpack");

var dotenv = require("dotenv").config({ path: __dirname + "/.env" });

module.exports = {
  mode: "production",
  entry: path.resolve(__dirname, "./code/odh-events.js"),
  output: {
    path: path.resolve(__dirname, "./dist"),
    filename: "odh-events.js",
  },
  plugins: [
    new webpack.DefinePlugin({
      "process.env.DOTENV": JSON.stringify(dotenv.parsed),
    }),
  ],
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
