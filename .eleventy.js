var env = process.env.ELEVENTY_ENV;

module.exports = function(eleventyConfig) {
  // static passthroughs
  eleventyConfig.addPassthroughCopy("src/site/static");

  return {
    dir: {
      input: "src/site",
      output: "public"
    },
    templateFormats : ["njk", "md"],
    htmlTemplateEngine : "njk",
    markdownTemplateEngine : "njk",
    passthroughFileCopy: true
  };
}
