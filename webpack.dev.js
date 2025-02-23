const commonConfig = require("./webpack.common.js"),
    { mergeConfigs } = require("webpack-merge"),
    CssMinimizer = require("css-minimizer-webpack-plugin"),
    pathModule = require("path");

module.exports = mergeConfigs(commonConfig, {
    mode: "development",
    devtool: "source-map",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: ["style-loader", "css-loader", "sass-loader"]
            }
        ]
    },
    output: {
        filename: 'bundle.js',
        path: pathModule.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'Client',
        clean: true,
    },
    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizer(),
        ],
        minimize: true,
    },
})