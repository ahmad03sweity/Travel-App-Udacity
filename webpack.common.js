import htmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from 'clean-webpack-plugin';
import CssMinimizerPlugin from "css-minimizer-webpack-plugin";

export const commonConfig = {
    entry: ["./src/client/index.js"],
    module: {
        rules: [
            {
                test: '/\.js$/',
                exclude: /node_modules/,
                loader: "babel-loader"
            },
        ]
    },

    optimization: {
        minimizer: [
            // For webpack@5 you can use the `...` syntax to extend existing minimizers (i.e. `terser-webpack-plugin`), uncomment the next line
            // `...`,
            new CssMinimizerPlugin(),
        ],
        minimize: true,
    },
    plugins: [
        new htmlWebpackPlugin({
            template: "./src/client/views/index.html",
            filename: "./index.html"
        }),
        new CleanWebpackPlugin({
            // Simulate the removal of files
            dry: true,
            // Automatically remove all unused webpack assets on rebuild
            cleanStaleWebpackAssets: true,
            // Write Logs to Console
            verbose: false,
            protectWebpackAssets: false,
        }),
    ],
};