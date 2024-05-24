const webpack = require("webpack");

module.exports = function override(config) {
  config.resolve.fallback = {
    fs: require.resolve("browserify-fs"),
    path: require.resolve("path-browserify"),
    assert: require.resolve("assert"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify/browser"),
    constants: require.resolve("constants-browserify"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    worker_threads: false,
  };

  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  return config;
};
