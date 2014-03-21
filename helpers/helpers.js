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

};
