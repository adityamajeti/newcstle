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

  Users.addUser = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const userId = uuidv5(`http://${req.UserInfo.tenantId}/${data.username}`, uuidv5.URL);
    const commonAttributes = {
      'emailaddress': data.email || null,
      'userid': userId,
      'givenname': data.firstname,
      'lastname': data.lastname,
      'mobile': data.mobile || null,
      'addresses': data.address || null
    };
    const uprofile = _.clone(data);
    uprofile.userId = userId;
    uprofile.tenantId = req.UserInfo.tenantId;
    uprofile.roles.push('Internal/everyone');
    const xml = template.createUserXml(data.username, data.password, data.roles || [], commonAttributes, data.attributes || []);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.addUser,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        Users.create(uprofile, (e, u) => {
          //
        });
        cb(null, uprofile);
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('User creation failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('User creation failed'));
        }
      }
    });
  };

  Users.deleteUser = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;

    const xml = template.deleteUserXml(data.username);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.deleteUser,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'User deleted successfully',
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('User deletion failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('User deletion failed'));
        }
      }
    });
  };

  Users.updateCredential = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.oldpassword}`).toString('base64')}`;
    const xml = template.updateCredentialsXml(data.username, data.oldpassword, data.newpassword);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.updateCredential,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'Password updated successfully',
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Password update failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Password update failed'));
        }
      }
    });
  };

  Users.updateCredentialByAdmin = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.updateCredentialsByAdminXml(data.username, data.newpassword);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.updateCredentialByAdmin,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'Password updated successfully',
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('Password update failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('Password update failed'));
        }
      }
    });
  };

  Users.getUserList = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.adminPassword}`).toString('base64')}`;
    const xml = template.getuserListXml(data.limit);

    const options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.User.listUsers,
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
            // result.Envelope.Body.listUsersResponse.return
            const lusers = _.map(result.Envelope.Body.listUsersResponse.return, (val) => {
              return {
                username: val,
                tenantId: req.UserInfo.tenantId,
                userId: uuidv5(`http://${req.UserInfo.tenantId}/${val}`, uuidv5.URL)
              };
            });
            cb(null, lusers);
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

  Users.updateUserProfile = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.password}`).toString('base64')}`;
    const xml = template.updateProfileXml(data.claims, data.username);

    const options = {
      url: gConfig.URL.Profile,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.Profile.setUserProfile,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (error) {
        cb(error);
      } else if (response && (response.statusCode == 200 || response.statusCode == 202)) {
        cb(null, {
          'message': 'User profile updated successfully',
        });
      } else {
        if (body) {
          const parser = new xml2js.Parser({
            explicitArray: false,
            tagNameProcessors: [xml2js.processors.stripPrefix]
          });
          parser.parseString(body, (err, result) => {
            if (err) {
              cb(ErrorHandler('User profile update failed'));
            } else {
              cb(ErrorHandler(result.Envelope.Body.Fault.faultstring));
            }
          });
        } else {
          cb(ErrorHandler('User profile update failed'));
        }
      }
    });
  };
};
