'use strict';
const elasticSchema = require('./elasticMapping.json');
const elasticConfig = require('../../config/config.local.json').elastic;
module.exports = {
  'db': {
    'name': 'db',
    'connector': 'memory'
  },
  'es': {
    'name': 'es',
    'connector': 'esv6',
    'index': elasticConfig.index,
    'hosts': elasticConfig.hosts,
    'mappingType': 'basedata',
    'mappingProperties': elasticSchema.mappingProperties,
    'mappings': [],
    'defaultSize': 1000,
    'log': false,
    'apiVersion': '6.0',
    'requestTimeout': 30000
  }
};
