const path = require("path");

module.exports = {
  entry: "./src/main.ts",
  output: {
    path: path.resolve(__dirname, "docs"),
    filename: "bundle.js"
  },
  module: {
    rules: [
      { test: /\.ts$/, use: "ts-loader" },
      { test: /\.js$/, use: "babel-loader" }
    ]
  },
  mode: "development"
};
