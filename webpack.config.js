import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from 'path'

export default {
    mode: 'production',
    entry: {
        content: './src/content/content.js',
        background: './src/background/background.js',
        camera: './src/mainCamera/index.jsx',
        tabcamera: './src/tabCamera/index.jsx',
        preview: './src/previewTab/index.jsx',
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/previewTab/preview.html',
            filename: 'preview.html',
            chunks: ['preview']
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve('manifest.json'), to: path.resolve('dist') }
            ]
        })
    ],
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            '@babel/preset-env',
                            ['@babel/preset-react', { 'runtime': 'automatic' }]
                        ]
                    }
                }
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
        ]
    }
};
