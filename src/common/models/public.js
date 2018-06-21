'use strict';

module.exports = (Public) => {
  Public.sharedClass.methods().forEach((method) => {
    if (method.isStatic) {
      Public.disableRemoteMethodByName(method.name);
    } else {
      Public.disableRemoteMethodByName(`prototype.${method.name}`);
    }
  });

  	Public.remoteMethod('newcastledevices', {
        description: ["newcastle devices"],
        accepts: [{
            arg: 'data',
            type: 'object',
            http: { "source": "body" },
            required: true
        }],
        returns: {
            type: 'object',
            root: true
        },
        http: {
            path: '/t/newcastle.com/cdp/v1/devices',
            verb: 'post',
            status: 200,
            errorStatus: 400
        }
    });
};
