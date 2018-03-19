'use strict';

module.exports = function(Domain) {
  Domain.validatesUniquenessOf('name', { message: 'A Domain with same name already exists' });
  Domain.validatesInclusionOf('status', { in: ['active', 'inactive'], message: 'Invalid status' });

};
