'use strict';
const NODE_ENV = process.env.NODE_ENV ? process.env.NODE_ENV : 'local';
const gConfig = require(`../../config/config.${NODE_ENV}.json`);
module.exports = {
  'URL': {
    'Tenant': `${gConfig.wso2.baseURL}/services/TenantMgtAdminService.TenantMgtAdminServiceHttpsSoap12Endpoint`,
    'User': `${gConfig.wso2.baseURL}/services/RemoteUserStoreManagerService.RemoteUserStoreManagerServiceHttpsSoap12Endpoint`,
    'Profile': `${gConfig.wso2.baseURL}/services/UserProfileMgtService.UserProfileMgtServiceHttpsSoap12Endpoint`
  },
  'Tenant': {
    'addTenant': 'urn:addTenant',
    'getTenant': 'urn:getTenant',
    'retriveTenants': 'urn:retrieveTenants',
    'updateTenant': 'urn:updateTenant',
    'deleteTenant': 'urn:deleteTenant',
    'activateTenant': 'urn:activateTenant',
    'deactivateTenant': 'urn:deactivateTenant'
  },
  'User': {
    'addUser': 'urn:addUser',
    'deleteUser': 'urn:deleteUser',
    'addRole': 'urn:addRole',
    'deleteRole': 'urn:deleteRole',
    'getTenantId': 'urn:getTenantId',
    'updateCredential': 'urn:updateCredentials',
    'updateCredentialByAdmin': 'urn:updateCredentialByAdmin',
    'getRoleNames': 'urn:getRoleNames',
    'getRoleListOfUser': 'urn:getRoleListOfUser',
    'getUserListOfRole': 'urn:getUserListOfRole',
    'listUsers': 'urn:listUsers',
    'isExistingRole': 'urn:isExistingRole',
    'isExistingUser': 'urn:isExistingUser',
    'updateRoleListOfUser': 'urn:updateRoleListOfUser'
  },
  'Profile': {
    'getUserProfile': 'urn:getUserProfile',
    'addUserClaimValue': 'urn:addUserClaimValue',
    'setUserProfile': 'urn:setUserProfile'
  },
  'Super_User_Permission': {
    'Role': 'SUPER_ADMIN'
  },
  'Organization_Permission': {
    'Role': 'ORGANIZATION_ADMIN'
  },
  'Engineer_Permission': {
    'Role': 'SYSTEM_ENGINEER'
  },
  'Super_ADMIN_USER': {
    'authuser': gConfig.wso2.adminUsername
  },
  'Super_ADMIN_PASSWORD': {
    'authpassword': gConfig.wso2.adminPassword
  },
  'Roles': [
    {
      'name': 'ORGANIZATION_ADMIN'
    },
    {
      'name': 'SYSTEM_ENGINEER'
    }
  ]
};
