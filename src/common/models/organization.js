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
    'prototype.__create__domains',
    'prototype.__delete__domains',
    'prototype.__destroyById__domains',
    'prototype.__updateById__domains',
    'prototype.__create__users',
    'prototype.__delete__users',
    'prototype.__destroyById__users',
    'prototype.__updateById__users',
  ];

  _.each(methodsToDisable, (method) => {
    Organization.disableRemoteMethodByName(method);
  });

  Organization.remoteMethod(
    'syncAllOrganizations', {
      description: ' Sync All Organizations from WSO2',
      accepts: [],
      returns: {
        arg: 'Organization',
        type: 'any',
        root: true
      },
      http: {
        path: '/sync',
        verb: 'post',
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
        arg: 'status',
        type: 'string',
        http: { source: 'path' },
        description: 'active / inactive',
        required: true
      }],
      returns: {
        arg: 'Organization',
        type: 'object',
        root: true
      },
      http: {
        path: '/:id/activate/:status',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );
};
