const yaml = require("js-yaml");

// Import filters
const dateFilter = require('./src/filters/date-filter.js');
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');
const { MultiWatching } = require("webpack");

const env = process.env.ELEVENTY_ENV;

module.exports = function(eleventyConfig) {
  // Static passthroughs for files like CSS, JS, images
  eleventyConfig.addPassthroughCopy("src/site/static");

  // Enable YAML data files to be processed
  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

  // Add filters
  eleventyConfig.addFilter('date', dateFilter);
  eleventyConfig.addFilter('markdown', markdownFilter);
  eleventyConfig.addFilter('w3date', w3DateFilter);

  // Create collections
  const livePosts = p => p.date <= new Date() && !p.data.draft;

  // Insights collection (filter drafts)
  eleventyConfig.addCollection("insights", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
            .filter(livePosts)
            .reverse();
  });

  // Insight drafts collection (filter non-live posts)
  eleventyConfig.addCollection("insightDrafts", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
            .filter(_ => !livePosts(_))
            .reverse();
  });

  // Create a collection for use cases, but based on the YAML file instead of Markdown
  eleventyConfig.addCollection("useCases", function(collectionApi) {
    // Access the global `use_cases` data from the YAML file
    const useCasesData = collectionApi.getAll()[0].data.use_cases;

    // Ensure the data is an array before sorting/returning
    if (Array.isArray(useCasesData)) {
      return useCasesData.sort((a, b) => Math.sign(a.order - b.order));
    } else {
      throw new Error("use_cases data is not an array");
    }
  });

  // This bit is required for the dev command (to avoid ignoring .gitignore files)
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
