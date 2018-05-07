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
    'addOrganization', {
      description: "Add Organization",
      accepts: [{
          arg: 'data',
          type: 'any',
          http: { source: 'body' },
          required: true
        },
        {
          arg: 'req',
          type: 'any',
          http: { source: 'req' },
          required: true
        }
      ],
      returns: {
        arg: 'tenants',
        type: 'object',
        root: true
      },
      http: {
        path: '/addOrganization',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'getAllOrganizations', {
      description: " Get All Organizations",
      accepts: [{
          arg: 'data',
          type: 'any',
          http: { source: 'body' },
          required: true
        },
        {
          arg: 'req',
          type: 'any',
          http: { source: 'req' },
          required: true
        }
      ],
      returns: {
        arg: 'tenants',
        type: 'object',
        root: true
      },
      http: {
        path: '/getAllOrganizations',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'updateOrganization', {
      description: " update Organization",
      accepts: [{
          arg: 'data',
          type: 'any',
          http: { source: 'body' },
          required: true
        },
        {
          arg: 'req',
          type: 'any',
          http: { source: 'req' },
          required: true
        }
      ],
      returns: {
        arg: 'tenants',
        type: 'object',
        root: true
      },
      http: {
        path: '/updateOrganization',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'deleteOrganization', {
      description: " delete Organization",
      accepts: [{
          arg: 'data',
          type: 'any',
          http: { source: 'body' },
          required: true
        },
        {
          arg: 'req',
          type: 'any',
          http: { source: 'req' },
          required: true
        }
      ],
      returns: {
        arg: 'tenants',
        type: 'object',
        root: true
      },
      http: {
        path: '/deleteOrganization',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'activateOrganization', {
      description: " activate Organization",
      accepts: [{
          arg: 'data',
          type: 'any',
          http: { source: 'body' },
          required: true
        },
        {
          arg: 'req',
          type: 'any',
          http: { source: 'req' },
          required: true
        }
      ],
      returns: {
        arg: 'tenants',
        type: 'object',
        root: true
      },
      http: {
        path: '/activateOrganization',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );

  Organization.remoteMethod(
    'deactivateOrganization', {
      description: " deactivate Organization",
      accepts: [{
          arg: 'data',
          type: 'any',
          http: { source: 'body' },
          required: true
        },
        {
          arg: 'req',
          type: 'any',
          http: { source: 'req' },
          required: true
        }
      ],
      returns: {
        arg: 'tenants',
        type: 'object',
        root: true
      },
      http: {
        path: '/deactivateOrganization',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );
};
