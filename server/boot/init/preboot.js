module.exports = function(app) {
  var Users = app.models.Users,
    _ = require('underscore');

  // Create default admin account and role
  var ADMIN_EMAIL = "admin@quantela.com",
    ADMIN_PASSWORD = "admin@123";


  //Pre Configurations

  var preConfig = require('../preconfig/pre-config.js')(app);

  function preload() {
    // if (!!process.env.cetanaINIT) {
    preConfig.RoleConfig(function() {
      preConfig.defaultAdminConfig(ADMIN_EMAIL, ADMIN_PASSWORD);

    });

    preConfig.DomainPreConfig(function() {
      // 
    });
    // }
  };

  Users.getDataSource().once("connected", function() {
    preload();
  });
  
}
