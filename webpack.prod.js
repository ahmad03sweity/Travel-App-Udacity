import ExtractCssPlugin from "mini-css-extract-plugin";
import MinifyJsPlugin from "terser-webpack-plugin";
import pathModule from "path";
import { commonConfig } from "./webpack.common.js";
import { merge } from "webpack-merge";
import MinifyCssPlugin from "css-minimizer-webpack-plugin";

export default merge(commonConfig, {
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
        path: pathModule.resolve(pathModule.dirname(new URL(import.meta.url).pathname).substring(1), 'dist'),
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
});