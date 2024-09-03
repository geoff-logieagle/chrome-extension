import HtmlWebpackPlugin from "html-webpack-plugin";
import CopyPlugin from "copy-webpack-plugin";
import path from 'path'

export default {
    mode: 'production',
    entry: {
        content: './src/content/content.js',
        background: './src/background/background.js',
        camera: './src/Camera/index.jsx',
        camerawrap: './src/Camera/CameraWrap.jsx'
    },
    output: {
        path: path.resolve('dist'),
        filename: '[name].js',
        clean: true
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './src/Camera/camera.html',
            filename: 'camera.html',
            chunks: ['camerawrap']
        }),
        new CopyPlugin({
            patterns: [
                { from: path.resolve('manifest.json'), to: path.resolve('dist') }
            ]
        })
    ],
    devtool: 'source-map',
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
