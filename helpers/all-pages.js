module.exports = function(params, callback) {
  'use strict';

  var assemble = params.assemble;
  var grunt    = params.grunt;
  var options  = assemble.options;
  var pages    = options.pages;

  var allpages = [];

  for (var i = 0; i < pages.length; i++) {
    if (pages[i].dest.indexOf('/work/') !== -1) {
      continue;
    }
    allpages.push(pages[i].data.permalink);
  }

  var all_pages = grunt.config('assemble.options.all_pages');
  if (!all_pages || typeof(all_pages) !== 'object') all_pages = [];
  all_pages = all_pages.concat(allpages);
  grunt.config('assemble.options.all_pages', all_pages);

  callback();
};

module.exports.options = {
  stage: 'render:pre:pages'
};
