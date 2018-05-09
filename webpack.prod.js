const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const join = require("path").join;

const CompressionPlugin = require("compression-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HappyPack = require("happypack");

const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");

module.exports = merge(common, {
    // entry: ["vue", "lodash"],
    plugins: [
        // extract the CSS
        new ExtractTextPlugin({
            filename: "[name].css",
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
        // gzip!!
        new CompressionPlugin({
            asset: "[path].gz[query]",
            algorithm: "gzip",
            test: /\.js$|\.css$/,
            threshold: 10240,
            minRatio: 0.8
        })
    ],
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: ExtractTextWebpackPlugin.extract([
                    { loader: "css-loader", options: { minimize: true } },
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
