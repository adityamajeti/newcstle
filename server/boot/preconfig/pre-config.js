// main configuration file
module.exports = function(app) {
  const {
    Users,
    Domain,
    Organization
  } = app.models,
    asyncLib = require('async'),
    _ = require('underscore');

  var ref = this,
    preConfig = require('./pre-config.json');

  // Pre-configuration add Device Vendors and Types by default

  ref.DomainPreConfig = function(cb) {
    asyncLib.each(preConfig.Domain, function(dmn, next) {
      Domain.findOne({
        "where": {
          "name": dmn.name
        }
      }, function(err, rls) {
        if (rls) {
          _.each(dmn, function(v, k) {
            rls[k] = v;
          });
          rls.save(function() {
            next();
          });
        } else {
          Domain.create(dmn, function() {
            next();
          });
        }
      });
    }, function(er) {
      cb(null, {});
    });
  };

  return ref;
};
