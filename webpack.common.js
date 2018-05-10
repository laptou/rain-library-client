const path = require("path");
const webpack = require("webpack");
const config = require("./config");

const ForkTsCheckerWebpackPlugin = require("fork-ts-checker-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");
const { VueLoaderPlugin } = require("vue-loader");

const plugins = [
    new VueLoaderPlugin(),
    new ForkTsCheckerWebpackPlugin({
        tslint: true,
        vue: true
    }),
    // Generate skeleton HTML file
    new HtmlWebpackPlugin({
        inject: true,
        template: "src/index.html",
        xhtml: true
    }),
    // manifest for fanciness
    // new WebpackPWAManifest({
    //     name: "Rain Institute Library",
    //     short_name: "RI Library",
    //     start_url: ".",
    //     display: "fullscreen",
    //     background_color: "#eee",
    //     description: "The official app of the Rain Institute Library.",
    //     theme_color: "#eee",
    //     icons: [
    //         {
    //             src: path.resolve(__dirname, "src/res/img/logo-lg.png"),
    //             sizes: [96, 128, 192, 256, 384, 512]
    //         }
    //     ]
    // }),
    // offline caching!
    // new WorkboxWebpackPlugin.GenerateSW({
    //     clientsClaim: true,
    //     skipWaiting: true
    // }),
    new CleanWebpackPlugin(["dist"], {
        verbose: false,
        exclude: ["vendor-bundles"]
    }),
];

module.exports = {
    entry: ["./src"],
    context: __dirname,
    plugins,
    output: {
        path: config.output,
        publicPath: "/",
        filename: "bundle.js"
    },
    optimization: {
        runtimeChunk: false,
        splitChunks: {
            chunks: "all", //Taken from https://gist.github.com/sokra/1522d586b8e5c0f5072d7565c2bee693
        }
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: { appendTsSuffixTo: [/\.vue$/], silent: false, transpileOnly: true }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: { name: "[path][name].[ext]", publicPath: "/" }
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
            vue$: "vue/dist/vue.esm.js",
            "@lib": path.join(__dirname, "src/lib"),
            "@component": path.join(__dirname, "src/component"),
            "@control": path.join(__dirname, "src/component/control"),
            "@page": path.join(__dirname, "src/component/page"),
            "@res": path.join(__dirname, "src/res")
        }
    }
};
