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
    const auth = `Basic ${new Buffer(`${req.UserInfo.username}:${data.authpassword}`).toString('base64')}`;

    let xml = template.createUserXml(data.roles, data.claims, data.username, data.password);

    var options = {
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
      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'User created successfully',
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

  Users.deleteUser = (data, req, cb) => {
    let authuser = gConfig.Super_ADMIN_USER.authuser;
    let authpassword = gConfig.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let username = data.username;

    let xml = template.deleteUserXml(username);

    var options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.deleteUser.soapaction,
        'Authorization': auth
      }
    };

    let callback = (error, response, body) => {
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

  Users.updateCredential = (data, req, cb) => {
    let authuser = gConfig.Super_ADMIN_USER.authuser;
    let authpassword = gConfig.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let username = data.username;
    let oldpassword = data.oldpassword;
    let newpassword = data.newpassword

    let xml = template.getupdateCredentialsXml(username, oldpassword, newpassword);

    var options = {
      url: gConfig.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': gConfig.updateCredentials.soapaction,
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



  }


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


    let callback = (error, response, body) => {
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
    };
    request(options, callback);



  }


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
    console.log(options);

    let callback = (error, response, body) => {
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
    };
    request(options, callback);



  }

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




  }


  Users.updateUserProfile = (data, req, cb) => {


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

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

    console.log(options);

    let callback = (error, response, body) => {
      console.log(response.statusCode);
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
    };
    request(options, callback);




  }

};
