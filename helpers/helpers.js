module.exports.register = function(Handlebars, options) {

  Handlebars.registerHelper('str', function(object) {
    return JSON.stringify(object);
  });

  Handlebars.registerHelper('obj_val', function(object, property) {
    return object ? object[property] : property;
  });

  Handlebars.registerHelper('BlogList', function(context, postsPerPage) {
    var currentPage = this.permalink;
    var currentPageNum = currentPage.match(/\/page\/(\d+)\//);
    if (currentPageNum) {
      currentPageNum = +currentPageNum[1];
    } else {
      currentPageNum = 1;
    }

    var options = arguments[arguments.length - 1];
    var ret = '';

    if (context && context.length > 0) {
      var array = [];
      for (var i = context.length - 1; i >= 0; i--) {
        if (context[i].src.indexOf('posts/blog') !== 0) continue;
        array.push(context[i]);
      }
      var s = (currentPageNum - 1) * postsPerPage;
      for (var i = s; i < s + postsPerPage; i++) {
        if (!array[i]) continue;
        ret += options.fn(array[i]);
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

  Handlebars.registerHelper('BlogPages', function(pagesArray, postsPerPage) {
    var totalPosts = 0;
    pagesArray.forEach(function(page) {
      if (page.src.indexOf('posts/blog') === 0) totalPosts += 1;
    });
    var totalPages = Math.ceil(totalPosts/postsPerPage);
    var currentPage = this.permalink;
    var currentPageNum = currentPage.match(/\/page\/(\d+)\//);
    if (currentPageNum) {
      currentPageNum = +currentPageNum[1];
    } else {
      currentPageNum = 1;
    }
    function makehref(i) {
      return '/blog/' + (i <= 1 ? '' : 'page/' + i + '/');
    }
    var ret = '';
    if (currentPageNum > 1) {
      ret = '<li><a href="' + makehref(currentPageNum-1) + '">上一页</a></li>'
    } else {
      ret += '<li><span>上一页</span></li>';
    }
    for (var i = 0; i < totalPages; i++) {
      var href = makehref(i+1);
      if (href === currentPage) {
        ret += '<li class="active"><span>' + (i + 1) + '</span></li>';
      } else {
        ret += '<li><a href="' + href + '">' + (i + 1) + '</a></li>';
      }
    }
    if (currentPageNum < totalPages) {
      ret += '<li><a href="' + makehref(currentPageNum+1) + '">下一页</a></li>'
    } else {
      ret += '<li><span>下一页</span></li>';
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
