'use strict';

module.exports = (Users) => {
  const _ = require('underscore');
  const methodsToDisable = ['create', 'updateAll', 'upsert', 'count',
    'replaceById',
    'replaceOrCreate',
    'createChangeStream',
    'upsertWithWhere',
    'deleteById',
    'prototype.patchAttributes',
    'prototype.__create__regions',
    'prototype.__delete__regions',
    'prototype.__destroyById__regions',
    'prototype.__updateById__regions',
    'prototype.__create__domains',
    'prototype.__delete__domains',
    'prototype.__destroyById__domains',
    'prototype.__updateById__domains',
  ];

  _.each(methodsToDisable, (method) => {
    Users.disableRemoteMethodByName(method);
  });

  Users.remoteMethod(
    'deleteUser', {
      description: 'Delete User',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/deleteUser',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Users.remoteMethod(
    'updateCredential', {
      description: 'Update Credentials',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/updateCredential',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Users.remoteMethod(
    'updateCredentialByAdmin', {
      description: 'Update Credentials',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/updateCredentialByAdmin',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Users.remoteMethod(
    'getUserList', {
      description: 'get user list',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/getUserList',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Users.remoteMethod(
    'getUserProfile', {
      description: 'get user profile',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/getUserProfile',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Users.remoteMethod(
    'addUserClaims', {
      description: 'Add User Claims',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/addUserClaims',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Users.remoteMethod(
    'updateUserProfile', {
      description: 'update user profile',
      accepts: [{
        arg: 'data',
        type: 'any',
        http: { source: 'body' },
        required: true
      }, {
        arg: 'req',
        type: 'any',
        http: { source: 'req' },
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/updateUserProfile',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );
};
