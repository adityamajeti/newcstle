'use strict';

module.exports = function(Entitytype) {
  Entitytype.validatesUniquenessOf('name',
  {message: 'A EntityType with same name already exists'});
  Entitytype.validatesInclusionOf('status',
   {in: ['active', 'inactive'], message: 'Invalid status'});
};
