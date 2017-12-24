const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const webpack = require("webpack");

module.exports = {
    entry: [
        "webpack-hot-middleware/client",
        "./src/main.ts"
    ],
    context: __dirname,
    plugins: [
        new HtmlWebpackPlugin({ template: "./src/index.html" }),
        new CleanWebpackPlugin(["dist"]),
        new webpack.NamedModulesPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ],
    devtool: "inline-source-map",
    output: {
        filename: "js/[name].bundle.js",
        path: path.resolve(__dirname, "dist")
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
        extensions: [".ts", ".js", ".vue", ".json"],
        alias: {
            "vue$": "vue/dist/vue.esm.js"
        }
    }
};
