'use strict';

module.exports = function(Role) {

	Role.remoteMethod(
    'addRole', {
      description: "Add Role",
      accepts: [
      {
        arg: 'data',
        type: 'any',
      http: {source: 'body'},
        required: true
      },
      {
        arg: 'req',
        type: 'any',
      http: {source: 'req'},
        required: true
      }
      ],
      returns: {
        arg: 'roles',
        type: 'object',
        root: true
      },
      http: {
        path: '/addRole',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
 
  );


  Role.remoteMethod(
    'deleteRole', {
      description: "Delete Role",
      accepts: [
      {
        arg: 'data',
        type: 'any',
      http: {source: 'body'},
        required: true
      },
      {
        arg: 'req',
        type: 'any',
      http: {source: 'req'},
        required: true
      }
      ],
      returns: {
        arg: 'roles',
        type: 'object',
        root: true
      },
      http: {
        path: '/deleteRole',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
 
  );

   Role.remoteMethod(
    'getAllRoles', {
      description: "get All Role",
      accepts: [
      {
        arg: 'data',
        type: 'any',
      http: {source: 'body'},
        required: false
      },
      {
        arg: 'req',
        type: 'any',
      http: {source: 'req'},
        required: true
      }
      ],
      returns: {
        arg: 'roles',
        type: 'object',
        root: true
      },
      http: {
        path: '/getAllRoles',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
 
  );

    Role.remoteMethod(
    'getAllUserRoles', {
      description: "get All User Role",
      accepts: [
      {
        arg: 'data',
        type: 'any',
      http: {source: 'body'},
        required: true
      },
      {
        arg: 'req',
        type: 'any',
      http: {source: 'req'},
        required: true
      }
      ],
      returns: {
        arg: 'roles',
        type: 'object',
        root: true
      },
      http: {
        path: '/getAllUserRoles',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
 
  );

    Role.remoteMethod(
    'getAllRoleUsers', {
      description: "get All  Role Users",
      accepts: [
      {
        arg: 'data',
        type: 'any',
      http: {source: 'body'},
        required: true
      },
      {
        arg: 'req',
        type: 'any',
      http: {source: 'req'},
        required: true
      }
      ],
      returns: {
        arg: 'roles',
        type: 'object',
        root: true
      },
      http: {
        path: '/getAllRoleUsers',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
 
  );

   Role.remoteMethod(
    'updateUserRole', {
      description: "update user role",
      accepts: [
      {
        arg: 'data',
        type: 'any',
      http: {source: 'body'},
        required: true
      },
      {
        arg: 'req',
        type: 'any',
      http: {source: 'req'},
        required: true
      }
      ],
      returns: {
        arg: 'roles',
        type: 'object',
        root: true
      },
      http: {
        path: '/updateUserRole',
        verb: 'post',
        status: 200,
        errorStatus: 400
      }
    }
 
  );


}