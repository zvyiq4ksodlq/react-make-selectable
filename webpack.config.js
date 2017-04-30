var path = require("path");

module.exports = {
  entry: path.join(__dirname, "src", "index.jsx"),
  target: "node",
  output: {
    path: path.join(__dirname, "dist"),
    filename: "build.js",
    libraryTarget: "umd"
  },
  externals: {
    react: "react",
    "react-dom": "react-dom",
    "prop-types": "prop-types"
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        use: {
          loader: "babel-loader"
        },
        include: [path.join(__dirname, "src")]
      }
    ]
  }
};
