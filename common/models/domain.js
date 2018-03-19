'use strict';

module.exports = function(Domain) {
  Domain.validatesUniquenessOf('name', { message: 'A Domain with same name already exists' });
  Domain.validatesInclusionOf('state', { in: ['active', 'inactive'], message: 'Invalid state' });

};
