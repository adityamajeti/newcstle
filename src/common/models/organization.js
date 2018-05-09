'use strict';
module.exports = (Organization) => {
  const _ = require('underscore');
  const methodsToDisable = [
    'create',
    'updateAll',
    'upsert',
    'count',
    'replaceById',
    'replaceOrCreate',
    'createChangeStream',
    'upsertWithWhere',
    'deleteById',
    'find',
    'findById',
    'prototype.patchAttributes',
    'prototype.__create__domains',
    'prototype.__delete__domains',
    'prototype.__destroyById__domains',
    'prototype.__updateById__domains',
    'prototype.__create__users',
    'prototype.__delete__users',
    'prototype.__destroyById__users',
    'prototype.__updateById__users',
    'prototype.__get__users',
    'prototype.__findById__users',
    'prototype.__count__users',
  ];

  _.each(methodsToDisable, (method) => {
    Organization.disableRemoteMethodByName(method);
  });

  Organization.remoteMethod(
    'getAllOrganizations', {
      description: ' Get All Organizations',
      accepts: [],
      returns: {
        arg: 'Organization',
        type: 'object',
        root: true
      },
      http: {
        path: '/',
        verb: 'get',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'updateOrganization', {
      description: 'update Organization',
      accepts: [{
        arg: 'id',
        type: 'string',
        http: { source: 'path' },
        required: true
      }, {
        arg: 'data',
        type: 'object',
        http: { source: 'body' },
        required: true
      }],
      returns: {
        arg: 'Organization',
        type: 'object',
        root: true
      },
      http: {
        path: '/:id',
        verb: 'put',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'deleteOrganization', {
      description: 'delete Organization',
      accepts: [{
        arg: 'tenantId',
        type: 'string',
        http: { source: 'path' },
        required: true
      }],
      returns: {
        arg: 'info',
        type: 'object',
        root: true
      },
      http: {
        path: '/:tenantId',
        verb: 'delete',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'activateOrganization', {
      description: ' activate Organization',
      accepts: [{
        arg: 'tenantId',
        type: 'string',
        http: { source: 'path' },
        required: true
      }, {
        arg: 'active',
        type: 'string',
        http: { source: 'path' },
        required: true
      }],
      returns: {
        arg: 'Organization',
        type: 'object',
        root: true
      },
      http: {
        path: '/:id/activate/:active',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );
};
