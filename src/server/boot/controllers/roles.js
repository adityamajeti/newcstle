var request = require('request');

var template = require('../util/templates');
var confs = require('../../gateway-config.js');

module.exports = function(app) {

  const {
    Role
  } = app.models;

  Role.addRole = (data, req, cb) => {

    let authuser = confs.Super_ADMIN_USER.authuser;
    let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let rolename = data.rolename;
    let xml = template.getaddRoleXml(rolename);


    var options = {
      url: confs.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': confs.addRole.soapaction,
        'Authorization': auth
      }
    };


    let callback = (error, response, body) => {

      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'Roles added successfully',

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


  Role.deleteRole = (data, req, cb) => {


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let authuser = confs.Super_ADMIN_USER.authuser;
    let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let rolename = data.rolename;
    let xml = template.deleteRoleXml(rolename);

    var options = {
      url: confs.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': confs.deleteRole.soapaction,
        'Authorization': auth
      }
    };


    let callback = (error, response, body) => {

      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'Roles deleted successfully',

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

  Role.getAllRoles = (data, req, cb) => {


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let authuser = confs.Super_ADMIN_USER.authuser;
    let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let xml = template.getallRolesXml();

    var options = {
      url: confs.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': confs.getRoleNames.soapaction,
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

          for (var inx = 0; inx < result.Envelope.Body.getRoleNamesResponse.return.length; inx++) {

            var rolenames = result.Envelope.Body.getRoleNamesResponse.return[inx];

            arraydata.push({
              rolenames: rolenames

            });

            if (inx == result.Envelope.Body.getRoleNamesResponse.return.length - 1) {

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



  Role.getAllUserRoles = (data, req, cb) => {


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let authuser = confs.Super_ADMIN_USER.authuser;
    let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    var username = data.username;
    let xml = template.getAllUserRolesXml(username);

    var options = {
      url: confs.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': confs.getRoleListOfUser.soapaction,
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

          if (Array.isArray(result.Envelope.Body.getRoleListOfUserResponse.return)) {

            for (var inx = 0; inx < result.Envelope.Body.getRoleListOfUserResponse.return.length; inx++) {

              var rolenames = result.Envelope.Body.getRoleListOfUserResponse.return[inx];

              arraydata.push({
                rolenames: rolenames

              });

              if (inx == result.Envelope.Body.getRoleListOfUserResponse.return.length - 1) {

                cb(null, arraydata);

              }


            }
          } else {
            cb(result.Envelope.Body.getRoleListOfUserResponse.return);

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



  Role.getAllRoleUsers = (data, req, cb) => {


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let authuser = confs.Super_ADMIN_USER.authuser;
    let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    var rolename = data.rolename;
    let xml = template.getAllUserForRolesXml(rolename);

    var options = {
      url: confs.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': confs.getUserListOfRole.soapaction,
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
          console.log(result.Envelope.Body.getUserListOfRoleResponse.return.length);

          if (result.Envelope.Body.getUserListOfRoleResponse.return != undefined) {

            if (Array.isArray(result.Envelope.Body.getUserListOfRoleResponse.return)) {
              for (var inx = 0; inx < result.Envelope.Body.getUserListOfRoleResponse.return.length; inx++) {

                var usernames = result.Envelope.Body.getUserListOfRoleResponse.return[inx];

                arraydata.push({
                  usernames: usernames

                });

                if (inx == result.Envelope.Body.getUserListOfRoleResponse.return.length - 1) {

                  cb(null, arraydata);

                }


              }
            } else {
              cb(null, result.Envelope.Body.getUserListOfRoleResponse.return);

            }
          } else {
            cb(null, 'No Users Assigned to this role');

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


  Role.updateUserRole = (data, req, cb) => {


    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

    let authuser = confs.Super_ADMIN_USER.authuser;
    let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let auth = 'Basic ' + new Buffer(authuser + ':' + authpassword).toString('base64');
    let username = data.username;
    let oldrole = data.oldrole;
    let newrole = data.newrole;
    let xml = template.updateUserRoleXml(username, oldrole, newrole);

    var options = {
      url: confs.URL.User,
      method: 'POST',
      body: xml,
      headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml.length,
        'SOAPAction': confs.updateUserRole.soapaction,
        'Authorization': auth
      }
    };


    let callback = (error, response, body) => {

      if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
        //console.log('Raw result', body);
        var resdata = {
          'message': 'Roles updated successfully',

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






}
