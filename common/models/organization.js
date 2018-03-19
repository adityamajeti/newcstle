'use strict';

module.exports = function(Organization) {
	Organization.validatesInclusionOf('status', { in: ['active', 'inactive'], message: 'Invalid status' });

  Organization.validatesFormatOf('realm', { with: /^[a-z][a-z0-9]{2,20}/, allowNull: false, message: "realm must be small-case alphanumeric with min length of 3 and max of 20." });
  Organization.validatesUniquenessOf('realm', { message: 'realm already exists' });

  Organization.disableRemoteMethodByName('prototype.__create__domains');
  Organization.disableRemoteMethodByName('prototype.__delete__domains');
  Organization.disableRemoteMethodByName('prototype.__destroyById__domains');
  Organization.disableRemoteMethodByName('prototype.__updateById__domains');

  Organization.disableRemoteMethodByName('prototype.__create__entities');
  Organization.disableRemoteMethodByName('prototype.__delete__entities');
  Organization.disableRemoteMethodByName('prototype.__destroyById__entities');
  Organization.disableRemoteMethodByName('prototype.__updateById__entities');
};
