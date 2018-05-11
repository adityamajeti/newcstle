'use strict';
module.exports = (app) => {
  const ds = app.datasources.db;

  ds.define('UserCreate', {
    'tenantId': {
      'type': 'string',
      'description': 'Organization ID eg: quantela.com',
      'required': 'true'
    },
    'username': {
      'type': 'string',
      'description': 'username',
      'required': 'true',
      'id': true
    },
    'password': {
      'type': 'string',
      'description': 'password',
      'required': 'true'
    },
    'roles': {
      'type': ['string'],
      'description': 'roles',
      'required': 'true'
    },
    'firstname': {
      'type': 'string',
      'description': 'firstname',
      'required': 'true'
    },
    'lastname': {
      'type': 'string',
      'description': 'lastname',
      'required': 'true'
    },
    'email': {
      'type': 'string',
      'description': 'email address',
      'required': 'true'
    },
    'mobile': {
      'type': 'string',
      'description': 'mobile number',
    },
    'address': {
      'type': 'string',
      'description': 'address'
    },
    'attributes': {
      'type': ['object'],
      'description': 'additional attributes'
    },
    'adminPassword': {
      'type': 'string',
      'description': 'admin password',
      'required': 'true'
    }
  });
};
