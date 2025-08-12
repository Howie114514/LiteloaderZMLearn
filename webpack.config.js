const { resolve } = require("path");
const webpackNodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  node: {
    __dirname: false,
  },
  entry: {
    index: resolve("src/index.js"),
    preload: resolve("src/renderer/preload.js"),
  },
  output: {
    path: __dirname + "/dist",
    filename: "[name].js",
  },
  externalsPresets: { node: true },
  externals: {
    electron: "require('electron')",
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: [["@babel/preset-env"], "@babel/preset-react"],
          },
        },
      },
      {
        test: /(\.css|\.html)$/,
        type: "asset/source",
      },
    ],
  },
  resolve: {
    extensions: [".js"],
    alias: {
      __dirname: "path.resolve(__dirname, '.')",
    },
  },
};
