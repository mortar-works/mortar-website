const yaml = require("js-yaml");

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

var env = process.env.ELEVENTY_ENV;

module.exports = function(eleventyConfig) {
  // static passthroughs
  eleventyConfig.addPassthroughCopy("src/site/static");

  // yaml data files
  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));


  eleventyConfig.addFilter('date', dateFilter);
  eleventyConfig.addFilter('markdown', markdownFilter);
  eleventyConfig.addFilter('w3date', w3DateFilter);


  // create collections
  const livePosts = p => p.date <= new Date() && !p.data.draft;

  eleventyConfig.addCollection("insights", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
            .filter(livePosts)
            .reverse();
  });

  eleventyConfig.addCollection("insightDrafts", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
            .filter( _ => !livePosts(_) )
            .reverse();
  });

  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget('src/site/static/js');
  eleventyConfig.addWatchTarget('src/site/static/css');

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
