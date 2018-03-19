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

};
