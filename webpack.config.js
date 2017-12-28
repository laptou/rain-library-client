const path = require("path");
const webpack = require("webpack");

const ExtractTextPlugin = require("extract-text-webpack-plugin");
const HtmlWebpackPlugin = require( "html-webpack-plugin");
const CleanWebpackPlugin = require( "clean-webpack-plugin");

const basePlugins = [
    // Generate skeleton HTML file
    new HtmlWebpackPlugin(
        {
            inject: true,
            template: "src/index.html"
        }),
    new CleanWebpackPlugin(["dist"])
];

const productionPlugins = [
    // Support older plugins/loaders that still use global options
    // see https://webpack.js.org/plugins/loader-options-plugin/
    new webpack.LoaderOptionsPlugin(
        {
            minimize: true,
            debug: false
        }),
    // Minify JavaScript
    new webpack.optimize.UglifyJsPlugin(
        {
            compress: {
                warnings: false
            },
            output: {
                comments: false
            },
            screwIe8: true,
            sourceMap: false
        }),
    new ExtractTextPlugin(
        {
            filename: "[name].[contenthash].css",
            disable: process.env.NODE_ENV === "development"
        })
];

const devPlugins = [
    new webpack.optimize.OccurrenceOrderPlugin(false),
    new webpack.NoEmitOnErrorsPlugin(),
    new webpack.NamedModulesPlugin(),
    new webpack.HotModuleReplacementPlugin()
];

const plugins = basePlugins.concat(process.env.NODE_ENV === "development" ? devPlugins : productionPlugins);

module.exports = {
    devtool: "source-map",
    devServer: {
        noInfo: true
    },
    entry: ["webpack-hot-middleware/client", "./src"],
    context: __dirname,
    plugins,
    output: {
        path: path.resolve("./dist"),
        filename: "bundle-[hash].js"
    },
    module: {
        rules: [
            {
                test: /\.scss$/,
                use: [
                    "css-loader",
                    "resolve-url-loader",
                    "sass-loader",
                    "postcss-loader"
                ]
            },
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader", options: {
                        appendTsSuffixTo: [/\.vue$/]
                    }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: { name: "[name].[ext]?[hash]" }
            },
            {
                test: /\.vue$/,
                loader: "vue-loader"
            }
        ]
    },
    resolve: {
        extensions: [".vue", ".ts", ".js"],
        alias: {
            "vue$": "vue/dist/vue.esm.js",
            "lib/": "./src/lib"
        }
    }
};
