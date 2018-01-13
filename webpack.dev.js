const merge = require("webpack-merge");
const common = require("./webpack.common");
const webpack = require("webpack");

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
        new webpack.HotModuleReplacementPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: "happypack/loader"
                // loader: "vue-loader",
                // options: {
                //     loaders: {
                //         scss: "vue-style-loader!css-loader!sass-loader"
                //     }
                // }
            }
        ]
    }
});