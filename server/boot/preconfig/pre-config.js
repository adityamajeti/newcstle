// main configuration file
module.exports = function(app) {
  const {
    Users,
    Domain,
    Role,
    RoleMapping,
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

  ref.RoleConfig = function(cb) {
    asyncLib.each(preConfig.Role, function(rl, next) {
      Role.findOne({
        "where": {
          "name": rl.name
        }
      }, function(err, rls) {
        if (rls) {
          next();
        } else {
          Role.create(rl, function() {
            next();
          });
        }
      });
    }, function(er) {
      cb(null, {});
    });

  };

  ref.defaultAdminConfig = function(ADMIN_EMAIL, ADMIN_PASSWORD) {
    var rOrg = Organization.findOne({ "where": { "realm": "root" } });
    var rUser = Users.findOne({ "where": { "and": [{ "email": ADMIN_EMAIL }, { "realm": "root" }] } });

    Promise.all([rOrg, rUser]).then(values => {
      var org = values[0],
        user = values[1];
      if (org && user) {
        Users.changeRole((user.id).toString(), "admin", (e, r) => {
          // 
        });
      } else if (org) {
        corg.users.create({
          "name": "Admin",
          "email": ADMIN_EMAIL,
          "password": ADMIN_PASSWORD,
          "status": "active"
        }, (er, usr) => {
          Users.changeRole((usr.id).toString(), "admin", (e, r) => {
            // 
          });
        });
      } else {
        Organization.create({
          "name": "Quantela, Inc",
          "realm": "root",
          "status": "active"
        }, (e, corg) => {
          corg.users.create({
            "name": "Admin",
            "email": ADMIN_EMAIL,
            "password": ADMIN_PASSWORD,
            "status": "active"
          }, (er, usr) => {
            Users.changeRole((usr.id).toString(), "admin", (e, r) => {
              // 
            });
          });

        });

      }
    }).catch(e => {
      // console.log(e)
    });
  };

  return ref;
};
