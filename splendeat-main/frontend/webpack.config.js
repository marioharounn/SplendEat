const path = require('path');

module.exports = {
    entry: './src/index.jsx',
    output: {
        filename: 'index-bundle.js',
        sourceMapFilename: "index-bundle.js.map",
        path: path.resolve(__dirname, '../backend/static'),
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: ["babel-loader", 'source-map-loader'],
            },
            {
                test: /\.(ts|tsx)$/,
                exclude: /node_modules/,
                use: ["ts-loader", 'source-map-loader'],
            },
            {
                test: /\.(css|scss)$/,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.(jpg|jpeg|png|gif|mp3|svg)$/,
                use: ["file-loader"],
            },
        ]
    },
    resolve: {
        extensions: ['', '.js', '.jsx', '.ts', '.tsx'],
    }
};