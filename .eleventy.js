const yaml = require("js-yaml");

// Import custom filters
const dateFilter = require('./src/filters/date-filter.js');   // Ensure this path is correct
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

module.exports = function(eleventyConfig) {
  // Static passthroughs
  eleventyConfig.addPassthroughCopy("src/site/static");

  // Enable YAML data files to be processed
  eleventyConfig.addDataExtension("yaml", contents => yaml.safeLoad(contents));

  // Add custom filters
  eleventyConfig.addFilter('date', dateFilter);
  eleventyConfig.addFilter('markdown', markdownFilter);
  eleventyConfig.addFilter('w3date', w3DateFilter);

  // Create a collection for blog posts (live posts only, no drafts)
  const livePosts = post => post.date <= new Date() && !post.data.draft;

  // Insights collection: Filter to show live posts only
  eleventyConfig.addCollection("insights", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
      .filter(livePosts)
      .reverse();
  });

  // Insight drafts collection: Show drafts only
  eleventyConfig.addCollection("insightDrafts", function(collection) {
    return collection.getFilteredByGlob("src/site/insights/*.md")
      .filter(post => post.data.draft)
      .reverse();
  });

  // Create useCases collection from the usecases.yaml file
  eleventyConfig.addCollection("useCases", function(collectionApi) {
    const useCasesData = collectionApi.getAll()[0].data.usecases;
    if (Array.isArray(useCasesData)) {
      return useCasesData;
    } else {
      throw new Error("usecases data is not an array");
    }
  });

  // **New caseStudies collection**: Pull Markdown files from case-studies folder
  eleventyConfig.addCollection("caseStudies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/case-studies/*.md")
      .filter(livePosts)
      .reverse();  // Reverse the order so newest case studies appear first
  });

  // Create a collection for solutions from the markdown files
  eleventyConfig.addCollection("solutions", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/solutions/*.md");
  });

 // Add a new 'news' collection
 eleventyConfig.addCollection("news", function (collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/site/news/*.md")
    .sort((a, b) => b.date - a.date) // Sort by date (newest first)
    .slice(0, 3); // Limit to the 3 most recent posts
});



  // Watch targets for development (live reload)
  eleventyConfig.setUseGitIgnore(false);
  eleventyConfig.addWatchTarget('src/site/static/js');
  eleventyConfig.addWatchTarget('src/site/static/css');

  // Final configuration for directories, file types, etc.
  return {
    dir: {
      input: "src/site",    // Input directory for content files
      output: "public"      // Output directory for the generated site
    },
    templateFormats: ["njk", "md"],   // Supported file formats
    htmlTemplateEngine: "njk",        // Template engine for HTML files
    markdownTemplateEngine: "njk",    // Template engine for Markdown files
    passthroughFileCopy: true         // Enable passthrough copy for static files
  };
};