const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const ExtractTextWebpackPlugin = require("extract-text-webpack-plugin");


const extractor = new ExtractTextWebpackPlugin("bundle-[contenthash].css");
const plugins = [
    // Generate skeleton HTML file
    new HtmlWebpackPlugin(
        {
            inject: true,
            template: "src/index.html"
        }),
    new CleanWebpackPlugin(["dist"], { verbose: false }),
    extractor
];

module.exports = {
    entry: ["./src"],
    context: __dirname,
    plugins,
    output: {
        path: path.join(__dirname, "dist"),
        filename: "bundle-[hash].js"
    },
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
                test: /\.ts$/,
                use: {
                    loader: "ts-loader", options: { appendTsSuffixTo: [/\.vue$/], silent: true }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: { name: "[name].[ext]?[hash]" }
            }
        ]
    },
    resolve: {
        extensions: [".vue", ".ts", ".js"],
        alias: {
            "vue$": "vue/dist/vue.esm.js",
            "@lib": path.join(__dirname, "src/lib/"),
            "@component": path.join(__dirname, "src/component/"),
            "@control": path.join(__dirname, "src/component/control"),
            "@page": path.join(__dirname, "src/component/page")
        }
    }
};