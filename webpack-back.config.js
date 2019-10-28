const path = require('path');
const nodeExternals = require('webpack-node-externals');
const CopyPlugin = require('copy-webpack-plugin');
// const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    target: 'node',
    entry: {
        app: ['./src/server/game-server.js']
    },
    output: {
        filename: 'server/game-server.js',
        path: path.resolve(__dirname, 'dist')
    },
    externals: [
        nodeExternals()
    ],
    resolve: {
        alias: {
            Modules: path.resolve(__dirname, 'node_modules')
        }
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader"
                }
            },
        ]
    },
    devtool: 'eval-source-map',
    plugins: [
        // new CleanWebpackPlugin(),
        new CopyPlugin([
            {
                from: './src/assets/',
                to: './assets',
                flatten: false
            }
        ])
    ]
};
