const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HappyPack = require("happypack");

const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
    plugins: [
        // extract the CSS
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css",
            allChunks: true
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        // Minify JavaScript
        new UglifyJsPlugin({
            sourceMap: false,
            parallel: true,
            uglifyOptions: {
                ecma: 8
            }
        }),
        new HappyPack({
            loaders: [
                "cache-loader",
                {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            scss:
                                "cache-loader!vue-style-loader!css-loader!sass-loader"
                        },
                        extractCSS: true
                    }
                }
            ],
            verbose: false
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract([
                    "cache-loader",
                    "css-loader",
                    "resolve-url-loader",
                    "sass-loader"
                ])
            },
            {
                test: /\.vue$/,
                loader: "happypack/loader"
            }
        ]
    }
});
