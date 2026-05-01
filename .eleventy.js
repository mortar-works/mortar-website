const yaml = require("js-yaml");

// Import custom filters
const dateFilter = require('./src/filters/date-filter.js');   // Ensure this path is correct
const markdownFilter = require('./src/filters/markdown-filter.js');
const w3DateFilter = require('./src/filters/w3-date-filter.js');

module.exports = function(eleventyConfig) {
  // Static passthroughs
  eleventyConfig.addPassthroughCopy("src/site/static");

  // Enable YAML data files to be processed
  eleventyConfig.addDataExtension("yaml", contents => yaml.load(contents));

  // Add custom filters
  eleventyConfig.addFilter('date', dateFilter);
  eleventyConfig.addFilter('markdown', markdownFilter);
  eleventyConfig.addFilter('w3date', w3DateFilter);
  eleventyConfig.addFilter('titlecase', str =>
    (str || '').replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
  );
  eleventyConfig.addFilter('filterByProduct', (collection, productSlug) =>
    (collection || []).filter(item => item.data.product === productSlug)
  );

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

  // Use-cases collection
  eleventyConfig.addCollection("useCases", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/use-cases/*.md")
      .filter(post => !post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  // Research collection
  eleventyConfig.addCollection("research", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/research/*.md")
      .filter(post => !post.data.draft)
      .sort((a, b) => b.date - a.date);
  });

  // **New caseStudies collection**: Pull Markdown files from case-studies folder
  eleventyConfig.addCollection("caseStudies", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/case-studies/*.md")
      .filter(livePosts)
      .reverse();  // Reverse the order so newest case studies appear first
  });

  // Create a collection for solutions from the markdown files
  eleventyConfig.addCollection("solutions", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/solutions/*.md")
      .filter(post => !post.data.draft);
  });

  // Services collection
  eleventyConfig.addCollection("services", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/services/*.md")
      .sort((a, b) => (a.data.order || 0) - (b.data.order || 0));
  });

  // Products collection
  eleventyConfig.addCollection("products", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/site/products/*.md")
      .filter(livePosts);
  });

 // Add a new 'news' collection
 eleventyConfig.addCollection("news", function (collectionApi) {
  return collectionApi
    .getFilteredByGlob("src/site/news/*.md")
    .sort((a, b) => b.date - a.date); // Sort by date (newest first)
});

  // 4 most recent company news articles (for about page hero)
  eleventyConfig.addCollection("recentCompanyNews", function (collectionApi) {
    return collectionApi
      .getFilteredByGlob("src/site/news/*.md")
      .filter(item => item.data.category === 'company')
      .sort((a, b) => b.date - a.date)
      .slice(0, 4);
  });

  // Pick the best featured post for a given filter category — pinned first, then most recent
  eleventyConfig.addFilter('featuredForCategory', (collection, category) => {
    if (category === 'all') return collection[0] || null;
    return collection.find(p => {
      const cats = p.data.categories
        ? p.data.categories.map(c => c.toLowerCase().replace(/ /g, '-'))
        : [(p.data.category || '').toLowerCase().replace(/ /g, '-')];
      return cats.includes(category);
    }) || null;
  });

  // Pinned items for the frontpage topline
  eleventyConfig.addCollection("pinned", function(collectionApi) {
    return collectionApi.getAll()
      .filter(item => item.data.pinned === true && !item.data.draft);
  });

  // Unified content feed — all folders, sorted by date, no drafts
  eleventyConfig.addCollection("allContent", function(collectionApi) {
    const insights    = collectionApi.getFilteredByGlob("src/site/insights/*.md");
    const useCases    = collectionApi.getFilteredByGlob("src/site/use-cases/*.md");
    const research    = collectionApi.getFilteredByGlob("src/site/research/*.md");
    const caseStudies = collectionApi.getFilteredByGlob("src/site/case-studies/*.md");
    const news        = collectionApi.getFilteredByGlob("src/site/news/*.md");
    const solutions   = collectionApi.getFilteredByGlob("src/site/solutions/*.md");
    const products    = collectionApi.getFilteredByGlob("src/site/products/*.md");
    const industries  = collectionApi.getFilteredByGlob("src/site/industries/*.md");
    return [...insights, ...useCases, ...research, ...caseStudies, ...news, ...solutions, ...products, ...industries]
      .filter(post => post.date <= new Date() && !post.data.draft)
      .sort((a, b) => {
        if (a.data.pinned && !b.data.pinned) return -1;
        if (!a.data.pinned && b.data.pinned) return 1;
        return b.date - a.date;
      });
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