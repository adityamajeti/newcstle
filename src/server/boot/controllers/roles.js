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

  const Role = {};

  Role.addRole = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.getaddRoleXml(data.role);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.addRole,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'Role created successfully'
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Role creation failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Role creation failed'));
        }
      }
    });
  };

  Role.deleteRole = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.deleteRoleXml(data.role);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.deleteRole,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'Role deleted successfully'
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Role deletion failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Role deletion failed'));
        }
      }
    });
  };

  Role.getAllRoles = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.getallRolesXml();

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.getRoleNames,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        const parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });

        parser.parseString(body, (err, result) => {
          if (result) {
            const roles = _.map(result.Envelope.Body.getRoleNamesResponse.return, (role) => {
              return {
                name: role
              };
            });
            cb(null, roles);
          } else {
            cb(ErrorHandler('Unable to fetch roles'));
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
              cb(ErrorHandler('Unable to fetch roles'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Unable to fetch roles'));
        }
      }
    });
  };

  Role.getAllUserRoles = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.getAllUserRolesXml(data.username);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.getRoleListOfUser,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        const parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });

        parser.parseString(body, (err, result) => {
          if (result) {
            const roles = _.map(result.Envelope.Body.getRoleListOfUserResponse.return, (role) => {
              return {
                name: role
              };
            });
            cb(null, roles);
          } else {
            cb(ErrorHandler('Unable to fetch roles'));
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
              cb(ErrorHandler('Unable to fetch roles'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Unable to fetch roles'));
        }
      }
    });
  };

  Role.getAllRoleUsers = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.getAllUserForRolesXml(data.role);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.getUserListOfRole,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        const parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });

        parser.parseString(body, (err, result) => {
          if (result) {
            const users = _.map(result.Envelope.Body.getUserListOfRoleResponse.return, (val) => {
              return {
                username: val,
                tenantId: req.UserInfo.tenantId,
                userId: uuidv5(`http://${req.UserInfo.tenantId}/${val}`, uuidv5.URL)
              };
            });
            cb(null, users);
          } else {
            cb(ErrorHandler('Unable to fetch users'));
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
              cb(ErrorHandler('Unable to fetch users'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Unable to fetch users'));
        }
      }
    });
  };

  Role.updateUserRole = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.updateUserRoleXml(data.username, data.oldrole, data.newrole);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.updateUserRole.soapaction,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'Role updated successfully'
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Role update failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Role update failed'));
        }
      }
    });
  };
};
