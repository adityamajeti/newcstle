'use strict'
module.exports = (app) => {
  const _ = require('underscore'),
    asyncLib = require('async'),
    {
      Organization,
      Users,
      Region,
      Domain
    } = app.models;


  const TenantACLValidator = (model, role, ACLChecker, method) => {
    if (typeof ACLChecker != 'undefined' && model) {
      model.beforeRemote(method, (ctx, instance, next) => {
        if (ctx.req.UserInfo.roles.indexOf('SUPER_ADMIN') > -1) {
          next();
        } else if (ctx.args.id && ctx.req.UserInfo.tenantId) {
          ACLChecker(role, ctx, instance, next);
        } else {
          let error = new Error('ACCESS_DENIED');
          error.statusCode = 401;
          next(error);
        }
      });
    }
  };

  let ACLMethods = {},
    ACLCheckPermission = {};

  // Organization ACLs

  ACLMethods['Organization'] = {}

  ACLMethods['Organization']['ORGANIZATION_ADMIN'] = [
    'prototype.__get__domains',
    'prototype.__findById__domains',
    'prototype.__count__domains',
    'prototype.__get__regions',
    'prototype.__findById__regions',
    'prototype.__count__regions',
    'prototype.__create__regions',
    'prototype.__updateById__regions',
    'prototype.__destroyById__regions',
    'prototype.__delete__regions',
    'prototype.__get__users',
    'prototype.__findById__users',
    'prototype.__count__users',
    'prototype.__create__users',
    'prototype.__updateById__users',
    'prototype.__destroyById__users'
  ];

  ACLMethods['Organization']['ALL'] = [
    'findById',
    'exists'
  ];

  ACLCheckPermission['Organization'] = (role, ctx, instance, next) => {
    if (role == 'ALL' && (ctx.req.UserInfo.tenantId === ctx.args.id)) {
      next();
    } else if (ctx.req.UserInfo.roles.indexOf(role) > -1 && (ctx.req.UserInfo.tenantId === ctx.args.id)) {
      next();
    } else {
      let error = new Error('ACCESS_DENIED');
      error.statusCode = 401;
      next(error);
    }
  };

  // Users ACLs

  ACLMethods['Users']['ORGANIZATION_ADMIN'] = [
    'prototype.__link__domains',
    'prototype.__unlink__domains',
    'prototype.__link__regions',
    'prototype.__unlink__regions'
  ];

  ACLMethods['Users']['ALL'] = [];

  ACLMethods['Users']['OWNER'] = [
    'prototype.__exists__domains',
    'prototype.__count__domains',
    'prototype.__get__domains',
    'prototype.__findById__domains',
    'prototype.__get__regions',
    'prototype.__exists__domains',
    'prototype.__count__domains',
    'prototype.__findById__regions'
  ];

  ACLCheckPermission['Users'] = (role, ctx, instance, next) => {
    if (role === 'ALL') {
      Users.findById(ctx.args.id, (err, usr) => {
        if (usr && (usr.tenantId == ctx.req.UserInfo.tenantId)) {
          next();
        } else {
          let error = new Error('ACCESS_DENIED');
          error.statusCode = 401;
          next(error);
        }
      });
    } else if (role === 'OWNER') {
      if (ctx.args.id && ctx.args.id == ctx.req.UserInfo.userId) {
        next();
      } else if (ctx.req.UserInfo.roles.indexOf('ORGANIZATION_ADMIN') > -1) {
        Users.findById(ctx.args.id, (err, usr) => {
          if (usr && (usr.tenantId == ctx.req.UserInfo.tenantId)) {
            next();
          } else {
            let error = new Error('ACCESS_DENIED');
            error.statusCode = 401;
            next(error);
          }
        });
      }
    } else if (role == 'ORGANIZATION_ADMIN' && (ctx.req.UserInfo.roles.indexOf('ORGANIZATION_ADMIN') > -1)) {
      Users.findById(ctx.args.id, (err, usr) => {
        if (usr && (usr.tenantId == ctx.req.UserInfo.tenantId)) {
          next();
        } else {
          let error = new Error('ACCESS_DENIED');
          error.statusCode = 401;
          next(error);
        }
      });
    } else {
      let error = new Error('ACCESS_DENIED');
      error.statusCode = 401;
      next(error);
    }
  };

  asyncLib.each(['Organization', 'Users'], (model, next) => {
    asyncLib.each(Object.keys(ACLMethods[model]), (role, next2) => {
      asyncLib.each(ACLMethods[model][role], (method, next3) => {
        TenantACLValidator(model, role, ACLCheckPermission[model], method);
        next3();
      }, (err3) => {
        next2();
      });
    }, (err2) => {
      next();
    });
  }, (err) => {
    // 
  });

}
