'use strict';

module.exports = (Public) => {
  Public.sharedClass.methods().forEach((method) => {
    method.isStatic ? Public.disableRemoteMethodByName(method.name) : Public.disableRemoteMethodByName(`prototype.${method.name}`);
  });

  Public.remoteMethod(
    'getOrganizationById', {
      description: 'Get Organization basic profile',
      accepts: [{
        arg: 'id',
        type: 'string',
        http: { source: 'path' },
        required: true
      }],
      returns: {
        arg: 'Organization',
        type: 'Organization',
        root: true
      },
      http: {
        path: '/organization/:id',
        verb: 'get',
        status: 200,
        errorStatus: 404
      }
    }
  );
};
