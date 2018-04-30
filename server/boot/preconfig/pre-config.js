'use strict';
// main configuration file
module.exports = (app) => {
  const {
    Users,
    Domain,
    Organization,
  } = app.models;
  const asyncLib = require('async');
  const _ = require('underscore');
  const ref = this;
  const preConfig = require('./pre-config.json');

  // Pre-configuration add Device Vendors and Types by default

  ref.DomainPreConfig = (cb) => {
    asyncLib.each(preConfig.Domain, (dmn, next) => {
      Domain.findOne({
        'where': {
          'name': dmn.name,
        },
      }, (err, rls) => {
        if (rls) {
          _.each(dmn, (v, k) => {
            rls[k] = v;
          });
          rls.save(() => {
            next();
          });
        } else {
          Domain.create(dmn, () => {
            next();
          });
        }
      });
    }, (er) => {
      cb(null, {});
    });
  };

  return ref;
};
