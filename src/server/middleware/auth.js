'use strict';

module.exports = (options) => {
  const jwtDecode = require('jwt-decode');
  const uuidv5 = require('uuid/v5');
  const _ = require('underscore');
  return (req, res, next) => {
    if (process.env.ATDEV && process.env.ATDEV == 'dev') {
      req.UserInfo = {
        'roles': ['admin', 'ORGANIZATION_ADMIN', 'SYSTEM_ENGINEER'],
        'username': 'admin@mycompany.com',
        'firstname': 'Bharath',
        'lastname': 'Reddy',
        'email': 'bharath.kontham@quantela.com',
        'usertype': 'APPLICATION_USER',
        'version': '1.0.0',
        'tenantId': 'mycompany.com',
        'userid': uuidv5('http://mycompany.com/admin', uuidv5.URL)
      };
      next();
    } else if (typeof req.headers['x-jwt-assertion'] != 'undefined') {
      req.JWTtoken = jwtDecode(req.headers['x-jwt-assertion']);
      req.UserInfo = {
        'roles': (typeof req.JWTtoken['http://wso2.org/claims/role'] === 'string') ? [req.JWTtoken['http://wso2.org/claims/role']] : req.JWTtoken['http://wso2.org/claims/role'],
        'username': req.JWTtoken['http://wso2.org/claims/enduser'],
        'firstname': req.JWTtoken['http://wso2.org/claims/givenname'] || '',
        'lastname': req.JWTtoken['http://wso2.org/claims/lastname'] || '',
        'email': req.JWTtoken['http://wso2.org/claims/emailaddress'] || '',
        'mobile': req.JWTtoken['http://wso2.org/claims/mobile'] || '',
        'address': req.JWTtoken['http://wso2.org/claims/addresses'] || '',
        'usertype': req.JWTtoken['http://wso2.org/claims/usertype'],
        'version': req.JWTtoken['http://wso2.org/claims/version'],
        'tenantId': (req.JWTtoken['http://wso2.org/claims/enduser']).substring((req.JWTtoken['http://wso2.org/claims/enduser']).lastIndexOf('@') + 1),
      };

      req.UserInfo.userId = req.JWTtoken['http://wso2.org/claims/userid'] ? req.JWTtoken['http://wso2.org/claims/userid'] : uuidv5(`http://${req.UserInfo.tenantId}/${req.UserInfo.username.replace(`@${req.UserInfo.tenantId}`, '')}`, uuidv5.URL);
      next();
    } else {
      const error = new Error('Authorization failed');
      error.statusCode = 401;
      next(error);
    }
  };
};
