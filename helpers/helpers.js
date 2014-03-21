module.exports.register = function(Handlebars, options) {

  Handlebars.registerHelper('str', function(object) {
    return JSON.stringify(object);
  });

};
