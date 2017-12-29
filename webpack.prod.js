const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");

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
            })
    ]
});