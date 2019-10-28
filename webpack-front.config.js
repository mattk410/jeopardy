const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
    entry: {
        // host: './src/client/js/host.js',
        // mobile: './src/client/js/player.js',
        // board: './src/client/js/board.js',
        app: './src/client/app.js'
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist/client'),
    },
    devtool: 'eval-source-map',
    plugins: [
        new HtmlWebpackPlugin({
            title: 'Jeopardy',
            filename: './index.html',
            template: './src/client/index.html',
            chunks: ['main']
        }),
        // new MiniCssExtractPlugin({
        //     filename: './css/styles.css',
        //     template: './src/css/styles.css',
        //     chunks: ['main']
        // }),
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    query: {
                        presets: ['react']
                    }
                },

            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader']

            }
            // {
            //     test: /\.css$/,  // cssRegex defined above as /\.css$/;
            //     // exclude: cssModuleRegex,
            //     use: getStyleLoaders({
            //         importLoaders: 1,
            //         // sourceMap: isEnvProduction && shouldUseSourceMap,
            //
            //         //this is the code tutor wrote.
            //         //================================================
            //         modules: true,
            //         getLocalIdent: getCSSModuleLocalIdent,
            //         localIdentName: '[name]__[local]__[hash:base64:5]'
            //         //================================================
            //
            //
            //     }),
            //     // Don't consider CSS imports dead code even if the
            //     // containing package claims to have no side effects.
            //     // Remove this when webpack adds a warning or an error for this.
            //     // See https://github.com/webpack/webpack/issues/6571
            //     sideEffects: true,
            // },
        ]
    },
};
