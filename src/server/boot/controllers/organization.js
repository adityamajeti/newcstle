'use strict';

var request = require('request');

var template = require('../util/templates');
var confs = require('../../global-config.json');
var asyncLib = require('async');


module.exports = (app) => {
  const {
    Organization,
    Users,
  } = app.models;


  Organization.addOrganization = (data, req, cb) => {

  // cb(null,"method called");
  let authuser = confs.Super_ADMIN_USER.authuser;
  let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let auth = "Basic " + new Buffer(authuser + ":" + authpassword).toString("base64");

  let active = data.active;
  let adminName = data.adminname;
  let adminPassword = data.adminPassword;
  let email = data.email;
  let firstName = data.firstname;
  let lastName = data.lastname;
  let tenantDomain = data.tenantDomain;


  let xml = template.CreateTenantXml(active, adminName, adminPassword, email, firstName,
   lastName, tenantDomain);



  var options = {
   url: confs.Tenant.url,
   method: 'POST',
   body: xml,
   headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length': xml.length,
    'SOAPAction': confs.addTenant.soapaction,
    'Authorization': auth
   }
  };


  let callback = (error, response, body) => {

   if (!error && response.statusCode == 200) {
    //console.log('Raw result', body);
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({
     explicitArray: false,
     tagNameProcessors: [xml2js.processors.stripPrefix]
    });

    parser.parseString(body, (err, result) => {
     console.log(result.Envelope.Body.addTenantResponse.return);

     asyncLib.each(confs.Roles, (rls, next) => {

      let xml1 = template.getaddRoleXml(rls.name);
      let domainauthuser = adminName + "@" + tenantDomain;
      let domainauth = "Basic " + new Buffer(domainauthuser + ":" + adminPassword).toString("base64");



      var options = {
       url: confs.User.url,
       method: 'POST',
       body: xml1,
       headers: {
        'Content-Type': 'text/xml',
        'Accept-Encoding': 'gzip,deflate',
        'Content-Length': xml1.length,
        'SOAPAction': confs.addRole.soapaction,
        'Authorization': domainauth
       }
      };

      let callback = (error, response, body) => {


       console.log(response.statusCode);
       if (response.statusCode == 200 || response.statusCode == 202) {

        let xml2 = template.updateUserRoleCreationXml(adminName,rls.name);

        var options1 = {
         url: confs.User.url,
         method: 'POST',
         body: xml2,
         headers: {
          'Content-Type': 'text/xml',
          'Accept-Encoding': 'gzip,deflate',
          'Content-Length': xml.length,
          'SOAPAction': confs.updateUserRole.soapaction,
          'Authorization': domainauth
         }
        };
       
        let callback1 = (error, response, body) => {
          console.log("userole updated"+response.statusCode);

         if (!error && (response.statusCode == 200 || response.statusCode == 202)) {
          //console.log('Raw result', body);
          next();

         }else if (response.statusCode == 500) {

            var xml2js = require('xml2js');
            var parser = new xml2js.Parser({
                explicitArray: false,
                tagNameProcessors: [xml2js.processors.stripPrefix]
            });
            parser.parseString(body, (err, result) => {
                console.log(result.Envelope.Body.Fault.faultstring);

                
            });

        }
         console.log('E', response.statusCode, response.statusMessage);
        };
        request(options1, callback1);

       }

      }
      request(options, callback);

     }, (err) => {});

     var resdata = {
      "message": "Tenant added successfully"
     }
     cb(null, resdata);


    });



   } else if (response.statusCode == 500) {
    console.log(body);
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({
     explicitArray: false,
     tagNameProcessors: [xml2js.processors.stripPrefix]
    });
    parser.parseString(body, (err, result) => {
     console.log(result.Envelope.Body.Fault.faultstring);

     var resdata = {
      "errorcode": response.statusCode,
      "message": result.Envelope.Body.Fault.faultstring

     }
     cb(resdata);

    });

   } else {
    var resdata = {
     "errorcode": response.statusCode,
     "message": "Internal server error"

    }
    cb(resdata);

   }
   console.log('E', response.statusCode, response.statusMessage);
  };
  request(options, callback);



 }

 Organization.getAllOrganizations = (data, req, cb) => {

  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let authuser = confs.Super_ADMIN_USER.authuser;
  let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
  let auth = "Basic " + new Buffer(authuser + ":" + authpassword).toString("base64");

  let xml = template.getAllTenantsXml();

  var options = {
   url: confs.Tenant.url,
   method: 'POST',
   body: xml,
   headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length': xml.length,
    'SOAPAction': confs.retriveTenant.soapaction,
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

     for (var inx = 0; inx < result.Envelope.Body.retrieveTenantsResponse.return.length; inx++) {

      var tenantId = result.Envelope.Body.retrieveTenantsResponse.return[inx].tenantId;
      var tenantDomain = result.Envelope.Body.retrieveTenantsResponse.return[inx].tenantDomain;

      arraydata.push({
       tenantId: tenantId,
       tenantDomain: tenantDomain
      });

      if (inx == result.Envelope.Body.retrieveTenantsResponse.return.length - 1) {

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
      "errorcode": response.statusCode,
      "message": result.Envelope.Body.Fault.faultstring

     }
     cb(resdata);
    });

   } else {
    var resdata = {
     "errorcode": response.statusCode,
     "message": "Internal server error"

    }
    cb(resdata);

   }
   console.log('E', response.statusCode, response.statusMessage);
  };
  request(options, callback);


 }

 Organization.updateOrganization = (data, req, cb) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let authuser = confs.Super_ADMIN_USER.authuser;
  let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
  let auth = "Basic " + new Buffer(authuser + ":" + authpassword).toString("base64");



  let active = data.active;
  let adminName = data.adminname;
  let adminPassword = data.adminPassword;
  let email = data.email;
  let firstName = data.firstname;
  let lastName = data.lastname;
  let tenantDomain = data.tenantDomain;
  let tenantId = data.tenantId;


  let xml = template.UpdateTenantXml(active, adminName, adminPassword, email, firstName,
   lastName, tenantDomain, tenantId);

  var options = {
   url: confs.Tenant.url,
   method: 'POST',
   body: xml,
   headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length': xml.length,
    'SOAPAction': confs.updateTenant.soapaction,
    'Authorization': auth
   }
  };
  console.log(options);
  let callback = (error, response, body) => {
   //console.log(response);
   if (!error && response.statusCode == 200) {
    //console.log('Raw result', body);

    var resdata = {
     "message": "Tenant updated successfully",

    }
    cb(null, resdata);


   } else if (response.statusCode == 500) {
    console.log(body);
    var xml2js = require('xml2js');
    var parser = new xml2js.Parser({
     explicitArray: false,
     tagNameProcessors: [xml2js.processors.stripPrefix]
    });
    parser.parseString(body, (err, result) => {
     console.log(result.Envelope.Body.Fault.faultstring);

     var resdata = {
      "errorcode": response.statusCode,
      "message": result.Envelope.Body.Fault.faultstring

     }
     cb(resdata);
    });

   } else {
    var resdata = {
     "errorcode": response.statusCode,
     "message": "Internal server error"

    }
    cb(resdata);

   }
   console.log('E', response.statusCode, response.statusMessage);
  };
  request(options, callback);


 }


 Organization.deleteOrganization = (data, req, cb) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let authuser = confs.Super_ADMIN_USER.authuser;
  let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
  let auth = "Basic " + new Buffer(authuser + ":" + authpassword).toString("base64");

  let tenantDomain = data.tenantDomain;

  let xml = template.getdeleteTenantXml(tenantDomain);

  var options = {
   url: confs.Tenant.url,
   method: 'POST',
   body: xml,
   headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length': xml.length,
    'SOAPAction': confs.deleteTenant.soapaction,
    'Authorization': auth
   }
  };


  let callback = (error, response, body) => {

   if (!error && response.statusCode == 200) {
    //console.log('Raw result', body);
    var resdata = {
     "message": "Tenant deleted successfully",

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
      "errorcode": response.statusCode,
      "message": result.Envelope.Body.Fault.faultstring

     }
     cb(resdata);
    });

   } else {
    var resdata = {
     "errorcode": response.statusCode,
     "message": "Internal server error"

    }
    cb(resdata);

   }
   console.log('E', response.statusCode, response.statusMessage);
  };
  request(options, callback);


 }


 Organization.activateOrganization = (data, req, cb) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let authuser = confs.Super_ADMIN_USER.authuser;
  let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
  let auth = "Basic " + new Buffer(authuser + ":" + authpassword).toString("base64");

  let tenantDomain = data.tenantDomain;

  let xml = template.getactivateTenantXml(tenantDomain);

  var options = {
   url: confs.Tenant.url,
   method: 'POST',
   body: xml,
   headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length': xml.length,
    'SOAPAction': confs.activateTenant.soapaction,
    'Authorization': auth
   }
  };


  let callback = (error, response, body) => {

   if (!error && response.statusCode == 200) {
    //console.log('Raw result', body);
    var resdata = {
     "message": "Tenant activated successfully",

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
      "errorcode": response.statusCode,
      "message": result.Envelope.Body.Fault.faultstring

     }
     cb(resdata);
    });

   } else {
    var resdata = {
     "errorcode": response.statusCode,
     "message": "Internal server error"

    }
    cb(resdata);

   }
   console.log('E', response.statusCode, response.statusMessage);
  };
  request(options, callback);


 }

 Organization.deactivateOrganization = (data, req, cb) => {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
  let authuser = confs.Super_ADMIN_USER.authuser;
  let authpassword = confs.Super_ADMIN_PASSWORD.authpassword;
  let auth = "Basic " + new Buffer(authuser + ":" + authpassword).toString("base64");

  let tenantDomain = data.tenantDomain;

  let xml = template.getdeactivateTenantXml(tenantDomain);

  var options = {
   url: confs.Tenant.url,
   method: 'POST',
   body: xml,
   headers: {
    'Content-Type': 'text/xml',
    'Accept-Encoding': 'gzip,deflate',
    'Content-Length': xml.length,
    'SOAPAction': confs.deactivateTenant.soapaction,
    'Authorization': auth
   }
  };


  let callback = (error, response, body) => {

   if (!error && response.statusCode == 200) {
    //console.log('Raw result', body);
    var resdata = {
     "message": "Tenant deactivated successfully",

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
      "errorcode": response.statusCode,
      "message": result.Envelope.Body.Fault.faultstring

     }
     cb(resdata);
    });

   } else {
    var resdata = {
     "errorcode": response.statusCode,
     "message": "Internal server error"

    }
    cb(resdata);

   }
   console.log('E', response.statusCode, response.statusMessage);
  };
  request(options, callback);


 }


};
