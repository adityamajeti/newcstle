'use strict';
module.exports = (app) => {
  const {
    Organization,
    Users,
  } = app.models;
  const uuidv5 = require('uuid/v5');
  const request = require('request');
  const xml2js = require('xml2js');
  const asyncLib = require('async');
  const _ = require('underscore');
  const template = require('../util/templates');
  const gConfig = require('../../gateway-config.js');
  const SuperAdminAuth = `Basic ${new Buffer(`${gConfig.Super_ADMIN_USER.authuser}:${gConfig.Super_ADMIN_PASSWORD.authpassword}`).toString('base64')}`;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

  const ErrorHandler = (message, data = null, statusCode = null, code = null) => {
    const error = new Error(message);
    if (data) {
      error.data = data;
    }

    if (statusCode) {
      error.statusCode = statusCode;
    }

    if (code) {
      error.code = code;
    }

    return error;
  };

  Organization.addOrganization = (data, cb) => {
    const tenantCreateXML = template.CreateTenantXml(data.adminUsername, data.adminPassword, data.email, data.firstname, data.lastname, data.tenantId);

    const options = {
      url: gConfig.URL.Tenant,
      method: 'POST',
      body: tenantCreateXML,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': tenantCreateXML.length,
        'SOAPAction': gConfig.Tenant.addTenant,
        'Authorization': SuperAdminAuth
      },
      timeout: 30000
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && response.statusCode && response.statusCode === 200) {
        const orgProfile = {
          tenantId: data.tenantId,
          name: data.name,
          email: data.email,
          address: data.address,
          locale: data.locale,
          timezone: data.timezone
        };
        const UserProfile = {
          tenantId: data.tenantId,
          username: data.adminUsername,
          userId: uuidv5(`http://${data.tenantId}/${data.adminUsername}`, uuidv5.URL),
          firstname: data.firstname,
          lastname: data.lastname,
          address: data.address,
          roles: ['Internal/subscriber', 'Internal/creator', 'Internal/publisher', 'Internal/everyone', 'admin', 'ORGANIZATION_ADMIN']
        };
        cb(null, orgProfile);
        Organization.findById(orgProfile.tenantId, (e, org) => {
          if (org) {
            _.each(orgProfile, (val, key) => {
              if (key !== 'tenantId') {
                org[key] = val;
              }
            });
            org.save(() => {
              Users.create(UserProfile, () => {
                //
              });
            });
          } else {
            Organization.create(orgProfile, () => {
              Users.create(UserProfile, () => {
                //
              });
            });
          }
        });
        Organization.addRolesToNewTenant(data, UserProfile);
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Organization creation failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Organization creation failed'));
        }
      }
    });
  };

  Organization.syncAllOrganizations = (cb) => {
    const xml = template.getAllTenantsXml();

    const options = {
      url: gConfig.URL.Tenant,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.Tenant.retriveTenants,
        'Authorization': SuperAdminAuth
      }
    };
    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && response.statusCode && response.statusCode === 200) {
        const parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          if (result) {
            const wso2tenants = _.map(result.Envelope.Body.retrieveTenantsResponse.return, (t) => {
              return { tenantId: t.tenantDomain, wso2Id: t.tenantId, status: (t.active === 'true' ? 'active' : 'inactive'), email: t.email, name: t.tenantDomain };
            });
            const tIds = _.map(wso2tenants, (t) => {
              return t.tenantId;
            });

            if (tIds.length) {
              Organization.find({
                'where': {
                  'tenantId': { inq: tIds }
                }
              }, (er4, orgs) => {
                if (orgs && orgs.length) {
                  if (orgs.length != wso2tenants.length) {
                    const orgoldtenants = _.map(orgs, (t) => {
                      return t.tenantId;
                    });
                    const newtenants = _.filter(wso2tenants, (t) => {
                      return orgoldtenants.indexOf(t.tenantId) === -1;
                    });
                    Organization.create(newtenants, (oer, orgs) => {
                      cb(null, wso2tenants);
                    });
                  } else {
                    cb(null, wso2tenants);
                  }
                } else {
                  Organization.create(wso2tenants, (oer, orgs) => {
                    cb(null, wso2tenants);
                  });
                }
              });
            } else {
              cb(null, wso2tenants);
            }
          } else {
            cb(ErrorHandler('Error fetching Organizations'));
          }
        });
      } else {
        cb(ErrorHandler('Error fetching Organizations'));
      }
    });
  };

  Organization.deleteOrganization = (tenantId, cb) => {
    const xml = template.deleteTenantXml(tenantId);

    const options = {
      url: gConfig.URL.RemoteTenant,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.RemoteTenant.deleteTenant,
        'Authorization': SuperAdminAuth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'Organization deleted successfully'
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Organization deletion failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Organization deletion failed'));
        }
      }
    });
  };

  Organization.activateOrganization = (tenantId, status, cb) => {
    let xml = template.activateTenantXml(tenantId);

    let options = {
      url: gConfig.URL.Tenant,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.Tenant.activateTenant,
        'Authorization': SuperAdminAuth
      }
    };
    if (status !== 'active') {
      xml = template.deactivateTenantXml(tenantId);
      options = {
        url: gConfig.URL.Tenant,
        method: 'POST',
        body: xml,
        headers: {
          'Content-Type': 'text/xml',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length': xml.length,
          'SOAPAction': gConfig.Tenant.deactivateTenant,
          'Authorization': SuperAdminAuth
        }
      };
    }

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        Organization.findById(tenantId, (er, td) => {
          if (td) {
            td.status = status === 'active' ? status : 'inactive';
            td.save(cb);
          } else {
            cb(null, {
              'tenantId': tenantId,
              'status': status === 'active' ? status : 'inactive'
            });
          }
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Organization update failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Organization deletion failed'));
        }
      }
    });
  };

  Organization.addRolesToNewTenant = (data, UserProfile) => {
    const domainauth = `Basic ${new Buffer(`${data.adminUsername}@${data.tenantId}:${data.adminPassword}`).toString('base64')}`;
    const addOrgAdminRoleToUser = template.updateUserRoleCreationXml(data.adminUsername, 'ORGANIZATION_ADMIN');

    asyncLib.each(gConfig.Roles, (rls, next) => {
      const createRoleXML = template.getaddRoleXml(rls.name);
      const options = {
        url: gConfig.URL.User,
        method: 'POST',
        body: createRoleXML,
        headers: {
          'Content-Type': 'text/xml',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length': createRoleXML.length,
          'SOAPAction': gConfig.User.addRole,
          'Authorization': domainauth
        }
      };

      request(options, (error, response, body) => {
        next();
      });
    }, (err) => {
      const options1 = {
        url: gConfig.URL.User,
        method: 'POST',
        body: addOrgAdminRoleToUser,
        headers: {
          'Content-Type': 'text/xml',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length': addOrgAdminRoleToUser.length,
          'SOAPAction': gConfig.User.updateRoleListOfUser,
          'Authorization': domainauth
        }
      };

      request(options1, (error, response, body) => {
        if (response && (response.statusCode == 200 || response.statusCode == 202)) {
          //
        }
      });

      const userIdClaim = template.setUserClaimXml('userid', UserProfile.userId, UserProfile.username);
      const options2 = {
        url: gConfig.URL.User,
        method: 'POST',
        body: userIdClaim,
        headers: {
          'Content-Type': 'application/soap+xml;charset=UTF-8;',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length': userIdClaim.length,
          'SOAPAction': gConfig.User.setUserClaimValue,
          'Authorization': domainauth
        }
      };

      request(options2, (error, response, body) => {
        if (response && (response.statusCode == 200 || response.statusCode == 202)) {
          //
        } else if (body) {
          //
        }
      });
    });
  };

  // Organization patchAttributes filter core attributes
  Organization.beforeRemote('prototype.patchAttributes', (ctx, instance, next) => {
    const filterargs = ['wso2Id', 'tenantId', 'status'];
    _.each(filterargs, (arg) => {
      delete ctx.args.data[arg];
    });
    next();
  });

  Organization.observe('before delete', (ctx, next) => {
    const modelId = (ctx.where && ctx.where.id) ? ctx.where.id : ((ctx.where && ctx.where.tenantId) ? ctx.where.tenantId : null);
    if (ctx.where && modelId) {
      Organization.findById(modelId, (e, r) => {
        if (r) {
          Organization.deleteOrganization(r.wso2Id, () => {
            next();
          });
        } else {
          next();
        }
      });
    } else {
      next();
    }
  });

  Organization.observe('after delete', (ctx, next) => {
    Users.find({
      'where': {
        'tenantId': ctx.where.id
      }
    }, (e, usrs) => {
      if (usrs) {
        asyncLib.each(usrs, (usr, nt) => {
          usr.destroy(() => {
            nt();
          });
        }, (er) => {
          //
        });
      }
    });
    next();
  });

  // Sync Organizations on boot
  // TODO: REDIS Kue Job
  setTimeout(() => {
    Organization.syncAllOrganizations(() => {
      //
    });
  }, 5 * 1000);
  setInterval(() => {
    Organization.syncAllOrganizations(() => {
      //
    });
  }, 30 * 60 * 1000);
};
