module.exports = function(params, callback) {
  'use strict';

  var assemble = params.assemble;
  var grunt    = params.grunt;
  var options  = assemble.options;
  var pages    = options.pages;

  var allpages = [];
  var allblog = [];

  for (var i = 0; i < pages.length; i++) {
    if (pages[i].dest.indexOf('/work/') !== -1) {
      continue;
    }
    allpages.push(pages[i].data.permalink);
    if (pages[i].src.slice(0, 11) === 'posts/blog/') {
      allblog.push({
        title: pages[i].data.title,
        permalink: pages[i].data.permalink,
        date: pages[i].data.date,
        excerpt: pages[i].data.excerpt ? pages[i].data.excerpt.trim() : undefined
      });
    }
  }

  var all_pages = grunt.config('assemble.options.all_pages');
  if (!all_pages || typeof(all_pages) !== 'object') all_pages = [];
  all_pages = all_pages.concat(allpages);
  grunt.config('assemble.options.all_pages', all_pages);

  var all_blog = grunt.config('assemble.options.all_blog');
  if (!all_blog || typeof(all_blog) !== 'object') all_blog = [];
  all_blog = all_blog.concat(allblog);
  grunt.config('assemble.options.all_blog', all_blog);

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
