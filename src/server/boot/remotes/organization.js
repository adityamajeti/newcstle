'use strict';
module.exports = (app) => {
  const {
    Organization,
  } = app.models;

  Organization.remoteMethod(
    'addOrganization', {
      description: 'Add Organization',
      accepts: [
        {
          arg: 'data',
          type: 'OrganizationCreate',
          http: { source: 'body' },
          required: true
        }
      ],
      returns: {
        arg: 'Organization',
        type: 'object',
        root: true
      },
      http: {
        path: '/',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
  );
};
