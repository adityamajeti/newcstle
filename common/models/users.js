'use strict';

module.exports = function(Users) {
  const _ = require('underscore'),
    methodsToDisable = [
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
      'prototype.__create__regions',
      'prototype.__delete__regions',
      'prototype.__destroyById__regions',
      'prototype.__updateById__regions',
      'prototype.__create__domains',
      'prototype.__delete__domains',
      'prototype.__destroyById__domains',
      'prototype.__updateById__domains'
    ];

  _.each(methodsToDisable, (method) => {
    Users.disableRemoteMethodByName(method);
  });
};
