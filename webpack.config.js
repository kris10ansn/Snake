const path = require("path");

module.exports = {
	mode: "production",
	entry: "./js/main.js",
	module: {
		rules: [
			{
				test: /\.js?$/,
				exclude: /node_modules/,
				include: [path.resolve(__dirname, "js")]
			}
		]
	},
	resolve: {
		extensions: [".js"]
	},
	output: {
		path: path.resolve(__dirname, "dist"),
		filename: "app.js"
	}
};
