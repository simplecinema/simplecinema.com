module.exports.register = function(Handlebars, options) {

  Handlebars.registerHelper('str', function(object) {
    return JSON.stringify(object);
  });

  Handlebars.registerHelper('BlogList', function(context) {
    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
      for (var i = context.length - 1; i >= 0; i--) {
        if (context[i].src.indexOf('posts/blog') !== 0) continue;
        ret += options.fn(context[i]);
      }
    } else {
      ret = options.inverse(this);
    }

    return ret;
  });

  Handlebars.registerHelper('eachReverseLimit', function(context, limit) {
    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
      for (var i = context.length - 1; i >= Math.max(0, context.length - limit); i--) {
        ret += options.fn(context[i]);
      }
    } else {
      ret = options.inverse(this);
    }

    return ret;
  });

  Handlebars.registerHelper('makeSitemapFor', function(context) {
    var options = arguments[arguments.length - 1];
    var ret = '';
    var pages = [];
    var date = new Date();
    for (var i = 0; i < context.length; i++) {
      var priority = 1;
      var changefreq = "daily";
      if (context[i].match(/\//g).length > 1) {
        priority -= 0.2;
      }
      if (!/\/$/.test(context[i])) {
        priority -= 0.2
        changefreq = "weekly";
      }
      pages.push({
        loc: context[i],
        lastmod: date,
        changefreq: changefreq,
        priority: priority.toFixed(1)
      });
    }
    pages.sort(function(a, b) {
      if (a.priority > b.priority) {
        return -1;
      } else if (a.priority == b.priority) {
        return a.loc > b.loc ? 1 : -1;
      } else {
        return 1;
      }
    });
    for (var i = 0; i < pages.length; i++) {
      ret += options.fn(pages[i]);
    }
    return ret;
  });

};
