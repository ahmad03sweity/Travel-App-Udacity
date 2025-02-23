const ExtractCssPlugin = require("mini-css-extract-plugin"),
    MinifyJsPlugin = require("terser-webpack-plugin"),
    pathModule = require("path"),
    commonConfig = require("./webpack.common.js");
const { merge } = require("webpack-merge"),
    MinifyCssPlugin = require("css-minimizer-webpack-plugin");

module.exports = merge(commonConfig, {
    mode: "production",
    devtool: "hidden-source-map",
    module: {
        rules: [
            {
                test: /\.s[ac]ss$/i,
                use: [ExtractCssPlugin.loader, "css-loader", "sass-loader"]
            },
        ]
    },
    output: {
        filename: 'bundle.[contenthash].js',
        path: pathModule.resolve(__dirname, 'dist'),
        libraryTarget: 'var',
        library: 'Client',
        clean: true,
    },
    optimization: {
        minimize: true,
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new MinifyCssPlugin(),
            new MinifyJsPlugin()
        ],
    },
    plugins: [
        new ExtractCssPlugin({
            filename: 'style.[contenthash].css'
        })
    ]
})