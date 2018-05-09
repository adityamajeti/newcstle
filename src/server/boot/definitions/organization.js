'use strict';
module.exports = (app) => {
  const ds = app.datasources.db;

  ds.define('OrganizationCreate', {
    'name': {
      'type': 'string',
      'description': 'Organization name',
      'required': 'true'
    },
    'tenantId': {
      'type': 'string',
      'description': 'Organization domain eg: quantela.com',
      'required': 'true'
    },
    'address': {
      'type': 'string',
      'description': 'address',
      'required': 'true'
    },
    'timezone': {
      'type': 'string',
      'description': 'timezone',
      'required': 'true'
    },
    'locale': {
      'type': ['string'],
      'description': 'language eg: ["en-US", "en-IN"]',
      'required': 'true'
    },
    'adminUsername': {
      'type': 'string',
      'description': 'admin username',
      'required': 'true'
    },
    'adminPassword': {
      'type': 'string',
      'description': 'admin password',
      'required': 'true'
    },
    'firstname': {
      'type': 'string',
      'description': 'admin firstname',
      'required': 'true'
    },
    'lastname': {
      'type': 'string',
      'description': 'admin lastname',
      'required': 'true'
    },
    'email': {
      'type': 'string',
      'description': 'email address of admin & Organization',
      'required': 'true'
    }
  });
};
