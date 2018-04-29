module.exports = function(app) {
  var Users = app.models.Users,
    _ = require('underscore');

  //Pre Configurations
  var preConfig = require('../preconfig/pre-config.js')(app);

  function preload() {
    // if (!!process.env.cetanaINIT) {
    preConfig.DomainPreConfig(function() {
      // 
    });
    // }
  };

  Users.getDataSource().once("connected", function() {
    preload();
  });
  
}
