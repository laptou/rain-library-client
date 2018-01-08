const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HappyPack = require("happypack");

module.exports = merge(common, {
    plugins: [
        // Minify JavaScript
        new UglifyJsPlugin(
            {
                sourceMap: false,
                parallel: true,
                uglifyOptions: {
                    ecma: 8
                }
            }),
        new ExtractTextPlugin(
            {
                filename: "[name].[contenthash].css",
                disable: process.env.NODE_ENV === "development"
            }),
        new webpack.DefinePlugin(
            {
                "process.env.NODE_ENV": JSON.stringify("production")
            }),
        new HappyPack({
                          loaders: ["cache-loader", {
                              loader: "vue-loader",
                              options: {
                                  loaders: {
                                      scss: "cache-loader!vue-style-loader!css-loader!sass-loader"
                                  },
                                  extractCSS: true
                              }
                          }],
                          verbose: false
                      })
    ],
    module:
        {
            rules: [
                {
                    test: /\.vue$/,
                    loader: "happypack/loader"
                }
            ]
        }
});