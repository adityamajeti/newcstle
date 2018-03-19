'use strict';

module.exports = function(Users) {
  Users.validatesInclusionOf('status', { in: ['active', 'inactive'], message: 'Invalid status' });

  Users.disableRemoteMethodByName('create');
  Users.disableRemoteMethodByName('updateAll');
  Users.disableRemoteMethodByName('upsert');
  Users.disableRemoteMethodByName('replaceById');
  Users.disableRemoteMethodByName('replaceOrCreate');
  Users.disableRemoteMethodByName('confirm');
  Users.disableRemoteMethodByName('createChangeStream');
  Users.disableRemoteMethodByName('upsertWithWhere');

  Users.disableRemoteMethodByName('prototype.__create__regions');
  Users.disableRemoteMethodByName('prototype.__delete__regions');
  Users.disableRemoteMethodByName('prototype.__destroyById__regions');
  Users.disableRemoteMethodByName('prototype.__updateById__regions');

  Users.disableRemoteMethodByName('prototype.__create__domains');
  Users.disableRemoteMethodByName('prototype.__delete__domains');
  Users.disableRemoteMethodByName('__destroyById__domains');
  Users.disableRemoteMethodByName('prototype.__updateById__domains');

  Users.remoteMethod(
    'getRole', {
      description: "Get the role of the User",
      accepts: [{
        arg: 'id',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'role',
        type: 'object',
        root: true
      },
      http: {
        path: '/:id/role',
        verb: 'get'
      }
    }
  );

  Users.remoteMethod(
    'findRoles', {
      description: "Get all the roles",
      accepts: [],
      returns: {
        arg: 'roles',
        type: 'any',
        root: true
      },
      http: {
        path: '/roles',
        verb: 'get'
      }
    }
  );

  Users.remoteMethod(
    'getUsersByRole', {
      description: "Get Users by Role name",
      accepts: [{
        arg: 'role',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'users',
        type: 'object',
        root: true
      },
      http: {
        path: '/role/:role',
        verb: 'get'
      }
    }
  );

  Users.remoteMethod(
    'changeRole', {
      description: "Add/Update role to the user",
      accepts: [{
        arg: 'id',
        type: 'string',
        required: true
      }, {
        arg: 'newRole',
        type: 'string',
        required: true
      }],
      returns: {
        arg: 'role',
        type: 'object',
        root: true
      },
      http: {
        path: '/:id/updateRole',
        verb: 'put',
        status: 200,
        errorStatus: 400
      }
    }
  );

};
