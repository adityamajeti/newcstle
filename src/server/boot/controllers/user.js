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

    var options = {
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
      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'User deleted successfully',
        }
        cb(null, resdata);
      } else if (response.statusCode == 500) {
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring
          }
          cb(resdata);
        });
      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'
        }
        cb(resdata);
      }
      console.log('E', response.statusCode, response.statusMessage);
    });
  };

  Users.updateCredential = (data, req, cb) => {
    const auth = `Basic ${new Buffer(`${data.username}:${data.oldpassword}`).toString('base64')}`;
    const xml = template.getupdateCredentialsXml(data.username, data.oldpassword, data.newpassword);

    var options = {
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
      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'Password updated successfully',
        }
        cb(null, resdata);
      } else if (response.statusCode == 500) {

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          console.log(result.Envelope.Body.Fault.faultstring);

          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring
          }
          cb(resdata);
        });
      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'
        }
        cb(resdata);
      }
      console.log('E', response.statusCode, response.statusMessage);
    });
  };

  Users.updateCredentialByAdmin = (data, req, cb) => {
    let authuser = gConfig.Super_ADMIN_USER.authuser;
    let authpassword = gConfig.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let username = data.username;
    let newpassword = data.newpassword

    let xml = template.getupdateCredentialsByAdminXml(username, newpassword);

    var options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.updateCredentialByAdmin.soapaction,
        'Authorization': auth
      }
    };

    let callback = (error, response, body) => {
      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'Password updated successfully',
        }
        cb(null, resdata);
      } else if (response.statusCode == 500) {
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          console.log(result.Envelope.Body.Fault.faultstring);

          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring

          }
          cb(resdata);
        });

      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'

        }
        cb(resdata);

      }
      console.log('E', response.statusCode, response.statusMessage);
    };
    request(options, callback);
  };

  Users.getUserList = (data, req, cb) => {
    let authuser = gConfig.Super_ADMIN_USER.authuser;
    let authpassword = gConfig.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let limit = data.limit;
    let xml = template.getuserListXml(limit);

    var options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.listUsers.soapaction,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      //console.log(response);
      if (!error && response.statusCode == 200) {
        //console.log('Raw result', body);
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });

        parser.parseString(body, (err, result) => {

          var arraydata = [];

          for (var inx = 0; inx < result.Envelope.Body.listUsersResponse.return.length; inx++) {

            var usernames = result.Envelope.Body.listUsersResponse.return[inx];

            arraydata.push({
              usernames: usernames

            });

            if (inx == result.Envelope.Body.listUsersResponse.return.length - 1) {

              cb(null, arraydata);

            }


          }



        });



      } else if (response.statusCode == 500) {

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          console.log(result.Envelope.Body.Fault.faultstring);

          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring

          }
          cb(resdata);
        });

      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'

        }
        cb(resdata);

      }
      console.log('E', response.statusCode, response.statusMessage);
    });
  };

  Users.getUserProfile = (data, req, cb) => {
    let authdetails = data.auth;
    let username = data.username;
    let authuser = authdetails[0].authuser;
    let authpassword = authdetails[1].authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let xml = template.getUserProfile(username);

    var options = {
      url: gConfig.URL.Profile,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.getProfile.soapaction,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      //console.log(response);
      if (!error && response.statusCode == 200) {
        //console.log('Raw result', body);
        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });

        parser.parseString(body, (err, result) => {

          var arraydata = [];
          console.log(result.Envelope.Body.getUserProfileResponse.return.fieldValues.length);

          for (var inx = 0; inx < result.Envelope.Body.getUserProfileResponse.return.fieldValues.length; inx++) {
            var usernames = result.Envelope.Body.getUserProfileResponse.return.fieldValues[inx].displayName;
            var value = result.Envelope.Body.getUserProfileResponse.return.fieldValues[inx].fieldValue;
            var check = value.$;
            if (check != undefined) {
              value = '';
            }

            arraydata.push({
              fieldname: usernames,
              fieldvalue: value

            });

            if (inx == result.Envelope.Body.getUserProfileResponse.return.fieldValues.length - 1) {
              cb(null, arraydata);
            }
          }
        });
      } else if (response.statusCode == 500) {

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          console.log(result.Envelope.Body.Fault.faultstring);

          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring

          }
          cb(resdata);
        });

      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'

        }
        cb(resdata);

      }
      console.log('E', response.statusCode, response.statusMessage);
    });
  };

  Users.addUserClaims = (data, req, cb) => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let claimkeys = data.userattributes;
    let authdetails = data.auth;
    let username = data.username;
    let auth = 'Basic ' + new Buffer(authdetails[0].authuser + ':' + authdetails[1].authpassword).toString('base64');
    let xml = template.createUserClaimsXml(claimkeys, username);

    var options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.addUserClaim.soapaction,
        'Authorization': auth
      }
    };



    let callback = (error, response, body) => {

      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'User claim added successfully',

        }
        cb(null, resdata);

      } else if (response.statusCode == 500) {

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          console.log(result.Envelope.Body.Fault.faultstring);

          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring

          }
          cb(resdata);
        });

      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'

        }
        cb(resdata);

      }
      console.log('E', response.statusCode, response.statusMessage);
    };
    request(options, callback);
  };

  Users.updateUserProfile = (data, req, cb) => {
    let claimkeys = data.userattributes;
    let authdetails = data.auth;
    let username = data.username;
    let auth = 'Basic ' + new Buffer(authdetails[0].authuser + ':' + authdetails[1].authpassword).toString('base64');

    let xml = template.updateProfileXml(claimkeys, username);

    var options = {
      url: gConfig.URL.Profile,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.updateProfile.soapaction,
        'Authorization': auth
      }
    };

    request(options, (error, response, body) => {
      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'User profile updated successfully',

        }
        cb(null, resdata);

      } else if (response.statusCode == 500) {

        var xml2js = require('xml2js');
        var parser = new xml2js.Parser({
          explicitArray: false,
          tagNameProcessors: [xml2js.processors.stripPrefix]
        });
        parser.parseString(body, (err, result) => {
          console.log(result.Envelope.Body.Fault.faultstring);

          var resdata = {
            'errorcode': response.statusCode,
            'message': result.Envelope.Body.Fault.faultstring

          }
          cb(resdata);
        });

      } else {
        var resdata = {
          'errorcode': response.statusCode,
          'message': 'Internal server error'

        }
        cb(resdata);

      }
      console.log('E', response.statusCode, response.statusMessage);
    });
  };
};
