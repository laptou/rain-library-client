const webpack = require("webpack");
const path = require("path");
const config = require("./config");

module.exports = {
    entry: {
        vue: ["vue", "vuex", "vue-router", "vuebar"],
        vendor: ["lodash", "moment"]
    },
    context: __dirname,
    output: {
        filename: "[name].dll.js",
        path: path.resolve(config.output, "vendor-bundles"),

        // The name of the global variable which the library's
        // require() function will be assigned to
        library: "[name]"
    },
    plugins: [
        new webpack.DllPlugin({
            // The path to the manifest file which maps between
            // modules included in a bundle and the internal IDs
            // within that bundle
            path: path.resolve(config.output, "vendor-bundles/[name].json"),
            // The name of the global variable which the library's
            // require function has been assigned to. This must match the
            // output.library option above
            name: "[name]"
        })
    ]
};
