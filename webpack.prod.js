const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");

const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HappyPack = require("happypack");

const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

const extractor = new ExtractTextWebpackPlugin("bundle-[contenthash].css");

module.exports = merge(common, {
    plugins: [
        // Minify JavaScript
        new UglifyJsPlugin({
            sourceMap: false,
            parallel: true,
            uglifyOptions: {
                ecma: 8
            }
        }),
        new ExtractTextPlugin({
            filename: "[name].[contenthash].css"
        }),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("production")
        }),
        extractor,
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
                use: extractor.extract([
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
