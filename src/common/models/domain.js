'use strict';
module.exports = (Domain) => {
  Domain.validatesUniquenessOf('name',
  	{ message: 'A Domain with same name already exists' });
  Domain.validatesInclusionOf('status',
  	{ in: ['active', 'inactive'], message: 'Invalid status' });
};
