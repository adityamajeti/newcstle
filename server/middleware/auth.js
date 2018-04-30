'use strict';

module.exports = (options) => {
  const jwtDecode = require('jwt-decode');
  return (req, res, next) => {
    if(process.env.ATDEV && process.env.ATDEV == "dev") {
      req.UserInfo = {
        "roles": ["admin", "ORGANIZATION_ADMIN", "SYSTEM_ENGINEER"],
        "username": "userzero@quantela.com",
        "firstname": "Bharath",
        "lastname": "Reddy",
        "email": "bharath.kontham@quantela.com",
        "usertype": "APPLICATION_USER",
        "version": "1.0.0",
        "tenantId": "quantela.com"
      };
      next();
    } else if (typeof req.headers['x-jwt-assertion'] != "undefined") {
      req.JWTtoken = jwtDecode(req.headers['x-jwt-assertion']);
      /* 
      	{ 'http://wso2.org/claims/role': 
      	   [ 'Internal/subscriber',
      	     'Internal/creator',
      	     'Application/admin_DefaultApplication_PRODUCTION',
      	     'Internal/publisher',
      	     'Internal/everyone',
      	     'admin',
      	     'OrganizationAdmin' ],
      	  'http://wso2.org/claims/applicationtier': 'Unlimited',
      	  'http://wso2.org/claims/keytype': 'PRODUCTION',
      	  'http://wso2.org/claims/version': '1.0.0',
      	  iss: 'wso2.org/products/am',
      	  'http://wso2.org/claims/applicationname': 'DefaultApplication',
      	  'http://wso2.org/claims/enduser': 'admin@jaipur.com',
      	  'http://wso2.org/claims/enduserTenantId': '1',
      	  'http://wso2.org/claims/givenname': 'John',
      	  'http://wso2.org/claims/subscriber': 'admin@jaipur.com',
      	  'http://wso2.org/claims/tier': 'Unlimited',
      	  'http://wso2.org/claims/emailaddress': 'jaipuradmin@quantela.com',
      	  'http://wso2.org/claims/lastname': 'Abraham',
      	  'http://wso2.org/claims/applicationid': '1',
      	  'http://wso2.org/claims/usertype': 'APPLICATION_USER',
      	  exp: 1524583059,
      	  'http://wso2.org/claims/apicontext': '/testapi/1.0.0' 
      	}
      */
      req.UserInfo = {
        "roles": (typeof req.JWTtoken['http://wso2.org/claims/role'] === 'string') ? [req.JWTtoken['http://wso2.org/claims/role']] : req.JWTtoken['http://wso2.org/claims/role'],
        "username": req.JWTtoken['http://wso2.org/claims/enduser'],
        "firstname": req.JWTtoken['http://wso2.org/claims/givenname'] ? req.JWTtoken['http://wso2.org/claims/givenname'] : '',
        "lastname": req.JWTtoken['http://wso2.org/claims/lastname'] ? req.JWTtoken['http://wso2.org/claims/lastname'] : '',
        "email": req.JWTtoken['http://wso2.org/claims/emailaddress'] ? req.JWTtoken['http://wso2.org/claims/emailaddress'] : '',
        "usertype": req.JWTtoken['http://wso2.org/claims/usertype'],
        "version": req.JWTtoken['http://wso2.org/claims/version'],
        "tenantId": (req.JWTtoken['http://wso2.org/claims/enduser']).substring((req.JWTtoken['http://wso2.org/claims/enduser']).lastIndexOf('@') + 1)
      };
      next();
    } else {
      let error = new Error('Authorization failed');
      error.statusCode = 401;
      next(error);
    }
  };
};
