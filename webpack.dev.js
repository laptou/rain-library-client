const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");
const happypack = require("happypack");
const CompressionPlugin = require("compression-webpack-plugin");
const WriteFilePlugin = require("write-file-webpack-plugin");

module.exports = merge(common, {
    devtool: "source-map",
    devServer: {
        noInfo: true
    },
    entry: ["webpack-hot-middleware/client"],
    plugins: [
        new webpack.optimize.OccurrenceOrderPlugin(false),
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify("development")
        }),
        new WriteFilePlugin(), // force webpack-dev-server to use filesystem instead of mem system
        new happypack({
            loaders: [
                {
                    loader: "vue-loader",
                    options: {
                        loaders: {
                            scss:
                                "vue-style-loader!css-loader!resolve-url-loader!sass-loader"
                        }
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
                loaders: [
                    "cache-loader",
                    "css-loader",
                    "resolve-url-loader",
                    "sass-loader"
                ]
            },
            {
                test: /\.vue$/,
                loader: "happypack/loader"
            }
        ]
    }
});
