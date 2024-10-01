const yaml = require("js-yaml");

module.exports = function(eleventyConfig) {
  // Passthrough for static files
  eleventyConfig.addPassthroughCopy("src/site/static");

  // Enable Eleventy to process YAML data files
  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

  // Add custom filters
  eleventyConfig.addFilter('date', require('./src/filters/date-filter.js'));
  eleventyConfig.addFilter('markdown', require('./src/filters/markdown-filter.js'));
  eleventyConfig.addFilter('w3date', require('./src/filters/w3-date-filter.js'));

  // Create insights collection
  eleventyConfig.addCollection("insights", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
            .filter(post => post.date <= new Date() && !post.data.draft)
            .reverse();
  });

  // Create insight drafts collection
  eleventyConfig.addCollection("insightDrafts", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
            .filter(post => post.data.draft)
            .reverse();
  });

  // Create useCases collection from the YAML file
  eleventyConfig.addCollection("useCases", function(collectionApi) {
    // Access the use_cases data from the global data (YAML)
    const useCasesData = collectionApi.getAll()[0].data.use_cases;

    // Check if useCasesData is an array, otherwise log an error
    if (Array.isArray(useCasesData)) {
      return useCasesData;
    } else {
      throw new Error("use_cases data is not an array");
    }
  });

  // Watch targets and other dev settings
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget('src/site/static/js');
  eleventyConfig.addWatchTarget('src/site/static/css');

  return {
    dir: {
      input: "src/site",
      output: "public"
    },
    templateFormats: ["njk", "md"],
    htmlTemplateEngine: "njk",
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true
  };
};
