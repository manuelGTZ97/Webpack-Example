const path = require('path');
const FlowBabelWebpackPlugin = require('flow-babel-webpack-plugin');
const ImageminPlugin = require("imagemin-webpack");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const HtmlWebpackplugin = require('html-webpack-plugin');
 
// Before importing imagemin plugin make sure you add it in `package.json` (`dependencies`) and install
const imageminGifsicle = require("imagemin-gifsicle");
const imageminJpegtran = require("imagemin-jpegtran");
const imageminOptipng = require("imagemin-optipng");
const imageminSvgo = require("imagemin-svgo");

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'bundle.min.js',
        path: path.resolve(__dirname, 'dist')
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules\/(?!(dom7|ssr-window|swiper)\/).*/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                } 
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            },
            {
                test: /\.(scss|sass)$/,
                use: [{
                  loader: 'style-loader', // inject CSS to page
                }, {
                  loader: 'css-loader', // translates CSS into CommonJS modules
                }, {
                  loader: 'postcss-loader', // Run post css actions
                  options: {
                    plugins: function () { // post css plugins, can be exported to postcss.config.js
                      return [
                        require('precss'),
                        require('autoprefixer')
                      ];
                    }
                  }
                }, {
                  loader: 'sass-loader' // compiles Sass to CSS
                }]
            },
            {
                test: /\.(jpe?g|png|gif|svg)$/i,
                use: [
                  {
                    loader: 'file-loader',
                    options: {
                        outputPath: 'images/',
                        name: '[name].[ext]'
                    }
                  }
                ]
            }
        ]
    },
    plugins: [
        new FlowBabelWebpackPlugin(),
        new HtmlWebpackplugin({
            minify:{
                collapseWhitespace: true
            },
            filename: 'index.html',
            template: './src/views/index.html'
        }),
        new ImageminPlugin({
            bail: false,
            cache: true,
            imageminOptions: {
                plugins: [
                    imageminGifsicle({
                        interlaced: true
                    }),
                    imageminJpegtran({
                        arithmetic: true
                    }),
                    imageminOptipng({
                        optimizationLevel: 5
                    }),
                    imageminSvgo({
                        removeViewBox: true
                    })
                ]
            }
        }),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 3000,
            server: { baseDir: ['./dist'] }
        })
    ]
};