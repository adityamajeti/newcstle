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
};
