'use strict';
module.exports = (app) => {
  const Users = app.models.Users;
  const  _ = require('underscore');

  // Pre Configurations
  const preConfig = require('../preconfig/pre-config.js')(app);

  const preload = () => {
    // if (!!process.env.cetanaINIT) {
    preConfig.DomainPreConfig(() => {
      //
    });
    // }
  };

  Users.getDataSource().once('connected', () => {
    preload();
  });
};
