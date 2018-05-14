'use strict';
module.exports = (app) => {
  const {
    Organization,
    Users,
    Public,
  } = app.models;

  const ErrorHandler = (message, data = null, statusCode = null, code = null) => {
    const error = new Error(message);
    if (data) {
      error.data = data;
    }

    if (statusCode) {
      error.statusCode = statusCode;
    }

    if (code) {
      error.code = code;
    }

    return error;
  };

  Public.getOrganizationById = (id, cb) => {
  	Organization.findById(id, (e, c) => {
  		if(c) {
  			cb(null, c);
  		} else {
  			cb(ErrorHandler(`Organization: ${id} not found`));
  		}
  	});
  };
};