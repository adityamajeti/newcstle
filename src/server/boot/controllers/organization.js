'use strict';
module.exports = (app) => {
  const {
    Organization,
    Users,
  } = app.models;
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
        cb(null, {
          'message': 'Organization added successfully'
        });
        Organization.addRolesToNewTenant(data);
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

  Organization.getAllOrganizations = (cb) => {
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
            cb(null, _.map(result.Envelope.Body.retrieveTenantsResponse.return, (t) => {
              return { tenantId: t.tenantDomain, id: t.tenantId };
            }));
          } else {
            cb(ErrorHandler('Error fetching Organizations'));
          }
        });
      } else {
        cb(ErrorHandler('Error fetching Organizations'));
      }
    });
  };

  Organization.updateOrganization = (id, data, cb) => {
    const xml = template.UpdateTenantXml(id, data.active, data.adminUsername,
      data.adminPassword, data.email, data.firstname, data.lastname, data.tenantId);

    const options = {
      url: gConfig.URL.Tenant,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.Tenant.updateTenant,
        'Authorization': SuperAdminAuth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && response.statusCode == 200) {
        cb(null, {
          'message': 'Tenant updated successfully',
        });
      } else {
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
      }
    });
  };

  Organization.deleteOrganization = (tenantId, cb) => {
    const xml = template.deleteTenantXml(tenantId);

    const options = {
      url: gConfig.URL.Tenant,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.Tenant.deleteTenant,
        'Authorization': SuperAdminAuth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && response.statusCode == 200) {
        cb(null, {
          'message': 'Organization deleted successfully'
        });
      } else {
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
      }
    });
  };

  Organization.activateOrganization = (tenantId, active, cb) => {
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
    if (active !== 'true' && active !== true) {
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
      } else if (response && response.statusCode == 200) {
        cb(null, {
          'message': 'Organization updated successfully'
        });
      } else {
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
      }
    });
  };

  Organization.addRolesToNewTenant = (data) => {
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
    });
  };
};
