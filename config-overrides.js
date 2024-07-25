const webpack = require("webpack");
const TerserPlugin = require("terser-webpack-plugin");

module.exports = function override(config) {
  config.resolve.fallback = {
    fs: require.resolve("browserify-fs"),
    crypto: require.resolve('crypto-browserify'),
    path: require.resolve("path-browserify"),
    assert: require.resolve("assert"),
    util: require.resolve("util/"),
    stream: require.resolve("stream-browserify"),
    os: require.resolve("os-browserify/browser"),
    constants: require.resolve("constants-browserify"),
    buffer: require.resolve("buffer/"),
    process: require.resolve("process/browser"),
    worker_threads: false,
    zlib: false,
    tls: false,
    net: false,
    dns: false,
    vm: false 
  };

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

  config.module.rules.push({
    test: /\.m?js$/,
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

  // Add TerserPlugin for minification
  config.optimization = {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          compress: {
            drop_console: true,
          },
        },
      }),
    ],
  };

  return config;
};
