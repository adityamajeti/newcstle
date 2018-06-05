'use strict';

module.exports = (options) => {
  const uuidv5 = require('uuid/v5');
  const _ = require('underscore');
  return (req, res, next) => {
    const {
      Organization,
      Users,
    } = req.app.models;
    const uprofile = _.clone(req.UserInfo);
    delete uprofile.usertype;
    delete uprofile.version;
    const orgprofile = {
      tenantId: uprofile.tenantId,
      name: uprofile.tenantId,
      email: '',
      address: uprofile.address
    };
    Users.exists(req.UserInfo.userId, (err, exists) => {
      if (exists) {
        next();
        Organization.exists(uprofile.tenantId, (e, t) => {
          if (!t || e) {
            Organization.create(orgprofile, () => {
              //
            });
          }
        });
      } else {
        Organization.exists(uprofile.tenantId, (e, t) => {
          if (!t || e) {
            Organization.create(orgprofile, () => {
              //
            });
          }
        });
        Users.create(uprofile, () => {
          next();
        });
      }
    });
  };
};
