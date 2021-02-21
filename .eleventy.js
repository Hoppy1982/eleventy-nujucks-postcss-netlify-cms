const htmlPretty = require("pretty");
const postcss = require("postcss");


module.exports = function(eleventyConfig) {
	/* HTML pretty */
	eleventyConfig.addTransform("html-pretty", function(content, outputPath) {
		if( outputPath.endsWith(".html") ) {
			return htmlPretty(content, { ocd: true });
		}
		return content;
	});


	/* Postcss */
	eleventyConfig.addTransform("postcss", async function(content, outputPath) {
		if ( outputPath.endsWith(".css") ) {
			const permalink = this.frontMatter.data.permalink.slice(1);

			return (
				await postcss([
					require("postcss-import"),
					require("postcss-nested"),
					require("postcss-mixins"),
					require("postcss-custom-properties"),
					require("autoprefixer")
				])
					.process(content, { from: permalink })
			).css;
		}
		return content;
	});


	/* Trigger build on css changes */
	eleventyConfig.addWatchTarget('./src/**');


	/* Config */
	return {
		dir: {
			input: "src",
			layouts: "templates/layouts",
			includes: "templates/includes",
			output: "_site"
		},
		templateFormats: ["njk"]
	};
};
