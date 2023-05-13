//webpack.config.js
const path = require('path')

module.exports = {
    mode: 'production',
    devtool: 'inline-source-map',
    entry: {
        main: './src/index.ts'
    },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: 'index.js' // <--- Will be compiled to this single file
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader'
            }
        ]
    }
}
