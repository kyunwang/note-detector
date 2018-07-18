const path = require('path');

const HTMLWebpackPlugin = require('html-webpack-plugin');
const PreloadWebpackPlugin = require('preload-webpack-plugin');

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
		// rel: 'preload',
		// 	as: 'script',
		// }),
	],
	module: {
		rules: [
			{
				test: /\.css$/,
				use: ['style-loader', 'css-loader'],
			},
		],
	},
};

module.exports = config;
