'use strict';
module.exports = (app) => {
 const Public = app.models.Public;
 const request = require('request');
 
  Public.newcastledevices = function(data, cb) {
        var options = {
            method: 'POST',
            url: 'https://ckc-emea.cisco.com/dsapi/v1/accounts/cdptoken?domain=newcastle.com',
            headers: { 'content-type': 'application/json' },
            body: {'username': 'quantelaoperator@newcastle.com',
                    'password': 'M557@xKq'},
            json: true,
            timeout: 45000
        };
        request(options, function(err, response, body) {         
            if (err) {
                cb(err);
            } else if (!!body && !!response && !!response.statusCode && response.statusCode == 200) {              
                var options1 = {
                    method: 'POST',
                    url: 'https://ckc-emea.cisco.com/t/newcastle.com/cdp/v1/devices',
                    headers: { 'content-type': 'application/json', 
                                'Authorization': 'Bearer '+ body.access_token },
                    body: data,
                    json: true,
                    timeout: 45000
                };
                request(options1, function(err1, response1, body1) {
                    if (err1) {
                        cb(err1);
                    } else if (!!body1 && !!response1 && !!response1.statusCode && response1.statusCode == 200) {
                        cb(null, body1);
                    }
                });
            }
        });
    };
};
