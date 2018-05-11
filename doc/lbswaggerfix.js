const _ = require('underscore');
const asyncLib = require('async');
const fs = require('fs');
console.log('one')
fs.readFile('./core-swagger-raw.json', (err, data) => {
	if(!err) {
		let jsonswagger = JSON.parse(data.toString());
		asyncLib.eachOf(jsonswagger.paths, (route, path, next) => {
			asyncLib.eachOf(route, (def, verb, next2) => {
				if(def.parameters) {
					_.each(def.parameters, (val) => {
						if(val.schema && val.schema.description) {
							delete val.schema.description;
						}
					});
					next2();
				} else {
					next2();
				}
			}, (e2) => {
				next();
			})
		}, (err) => {
			fs.writeFile('./core-swagger-fix.json', JSON.stringify(jsonswagger), (err) => {
				// 
			})
		});
	}
});