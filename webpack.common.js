const path = require("path");
const webpack = require("webpack");

const HtmlWebpackPlugin = require("html-webpack-plugin");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const AutoDllWebpackPlugin = require("autodll-webpack-plugin");
const HardSourceWebpackPlugin = require("hard-source-webpack-plugin");
const WebpackPWAManifest = require("webpack-pwa-manifest");
const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

const plugins = [
    // Generate skeleton HTML file
    new webpack.optimize.CommonsChunkPlugin({
        async: true
    }),
    new HtmlWebpackPlugin({
        inject: true,
        template: "src/index.html",
        xhtml: true
    }),
    new AutoDllWebpackPlugin({
        inject: true, // will inject the DLL bundles to index.html
        filename: "[name].dll.js",
        entry: {
            vendor: ["vue", "moment", "lodash"]
        }
    }),
    // manifest for fanciness
    new WebpackPWAManifest({
        name: "Rain Institute Library",
        short_name: "RI Library",
        start_url: ".",
        display: "fullscreen",
        background_color: "#eee",
        description: "The official app of the Rain Institute Library.",
        theme_color: "#eee",
        icons: [
            {
                src: path.resolve("src/res/img/logo-lg.png"),
                sizes: [96, 128, 192, 256, 384, 512]
            }
        ]
    }),
    // offline caching!
    new WorkboxWebpackPlugin({
        clientsClaim: true,
        skipWaiting: true
    }),
    new CleanWebpackPlugin(["dist"], {
        verbose: false,
        exclude: ["vue", "moment", "lodash"]
            .map(j => [j + ".dll.js", j + ".json"])
            .reduce((p, c) => p.concat(c))
    }),
    new HardSourceWebpackPlugin()
];

module.exports = {
    entry: ["./src"],
    context: __dirname,
    plugins,
    output: {
        path: require("./config").output,
        filename: "bundle.js"
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: {
                    loader: "ts-loader",
                    options: { appendTsSuffixTo: [/\.vue$/], silent: true }
                },
                exclude: /node_modules/
            },
            {
                test: /\.(png|svg|jpg|gif)$/,
                loader: "file-loader",
                options: { name: "[path][name].[ext]", publicPath: "/" }
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
