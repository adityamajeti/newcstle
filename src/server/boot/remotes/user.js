'use strict';
module.exports = (app) => {
  const {
    Users,
  } = app.models;

  Users.remoteMethod(
    'addUser', {
      description: 'Add User',
      accepts: [
        {
          arg: 'data',
          type: 'UserCreate',
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
        arg: 'users',
        type: 'Users',
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
