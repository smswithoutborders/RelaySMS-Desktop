const webpack = require("webpack");

module.exports = function override(config) {
  // Add the fallback configurations
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
    tls: false,
    net: false,
    dns: false,
    fs: false,
  };

  // Add the new rule for handling image files
  config.module.rules.push({
    test: /\.(png|ico|icns)$/,
    use: [
      {
        loader: "file-loader",
        options: {
          name: "[path][name].[ext]",
          context: "public",
        },
      },
    ],
  });

  // Add the rule to handle .m?js files
  config.module.rules.push({
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  });

  // Add the ProvidePlugin
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      Buffer: ["buffer", "Buffer"],
      process: "process/browser",
    }),
  ]);

  return config;
};
