const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin'); // Not supported in wp4
const UglifyWebpackPlugin = require('uglifyjs-webpack-plugin');

require('dotenv').config({ path: './vars.env' });

const config = {
	mode: process.env.WEBPACK_SERVE ? 'development' : 'production',
	entry: './src/scripts',
	// Config for webpack-serve
	serve: {
		host: process.env.HOST,
		port: process.env.PORT,
		open: true,
	},
	plugins: [
		new HTMLWebpackPlugin({
			title: 'Webpack demo',
			template: path.resolve(__dirname, 'index.html'),
		}),
		// new PreloadWebpackPlugin({
		// 	rel: 'preload',
		// 	as: 'script',
		// }),
	],
	optimization: {
		minimizer: [new UglifyWebpackPlugin({ sourceMap: true })],
	},
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
			{
				test: /\.js$/,
				use: 'babel-loader',
			},
		],
	},
};

module.exports = config;
