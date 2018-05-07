const _ = require('underscore');

exports.CreateTenantXml = (active, adminName, adminPassword, email, firstName,
  lastName, tenantDomain) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org" xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addTenant><ser:tenantInfoBean><xsd:active>${active}</xsd:active><xsd:admin>${adminName}</xsd:admin><xsd:adminPassword>${adminPassword}</xsd:adminPassword><xsd:email>${email}</xsd:email><xsd:firstname>${firstName}</xsd:firstname><xsd:lastname>${lastName}</xsd:lastname><xsd:tenantDomain>${tenantDomain}</xsd:tenantDomain></ser:tenantInfoBean></ser:addTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getAllTenantsXml = () => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:retrieveTenants/></soapenv:Body></soapenv:Envelope>`;

  return xml;

};

exports.getAllTenantByDomainXml = (req, res) => {

  var input = req.body;
  var tenantDomain = input.tenantDomain;

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:getTenant><ser:tenantDomain>${tenantDomain}</ser:tenantDomain></ser:getTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;

};


exports.UpdateTenantXml = (active, adminName, adminPassword, email, firstName,
  lastName, tenantDomain, tenantId) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org" xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:updateTenant><ser:tenantInfoBean><xsd:active>${active}</xsd:active><xsd:admin>${adminName}</xsd:admin><xsd:adminPassword>${adminPassword}</xsd:adminPassword><xsd:email>${email}</xsd:email><xsd:firstname>${firstName}</xsd:firstname><xsd:lastname>${lastName}</xsd:lastname><xsd:tenantDomain>${tenantDomain}</xsd:tenantDomain><xsd:tenantId>${tenantId}</xsd:tenantId></ser:tenantInfoBean></ser:updateTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getdeleteTenantXml = (tenantDomain) => {
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deleteTenant><ser:tenantDomain>${tenantDomain}</ser:tenantDomain></ser:deleteTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;

};

exports.getdeactivateTenantXml = (tenantDomain) => {
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deactivateTenant><ser:tenantDomain>${tenantDomain}</ser:tenantDomain></ser:deactivateTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;

};


exports.getactivateTenantXml = (tenantDomain) => {
  var tenantDomain = input.tenantDomain;
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:activateTenant><ser:tenantDomain>${tenantDomain}</ser:tenantDomain></ser:activateTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;

};

//add role



exports.getaddRoleXml = (rolename) => {
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://dao.service.ws.um.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addRole><ser:roleName>${rolename}</ser:roleName></ser:addRole></soapenv:Body></soapenv:Envelope>`;

  return xml;

};

exports.deleteRoleXml = (rolename) => {
  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deleteRole><ser:roleName>${rolename}</ser:roleName></ser:deleteRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.createUserXml = (rolename, claimkeys, username, password) => {
  let rolesXml = '';
  let claimsXml = '';

  _.each(rolename, (rl) => {
    rolesXml += `<ser:roleList>${rl.rolename}</ser:roleList>`;
  });

  _.each(claimkeys, (cl) => {
    claimsXml += `<ser:claims><xsd:claimURI>http://wso2.org/claims/${cl.key}</xsd:claimURI><xsd:value>${cl.value}</xsd:value></ser:claims>`;
  });

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addUser><ser:userName>${username}</ser:userName><ser:credential>${password}</ser:credential>${rolesXml}${claimsXml}<ser:profileName>default</ser:profileName><ser:requirePasswordChange>false</ser:requirePasswordChange></ser:addUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
}

exports.deleteUserXml = (username) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deleteUser><ser:userName>${username}</ser:userName></ser:deleteUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.gettenantIdXml = (req, res) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:getTenantId/></soapenv:Body></soapenv:Envelope>`;

  return xml;
};


exports.getupdateCredentialsXml = (username, oldpassword, newpassword) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:updateCredential> <ser:userName>${username}</ser:userName><ser:newCredential>${newpassword}</ser:newCredential><ser:oldCredential>${oldpassword}</ser:oldCredential> </ser:updateCredential></soapenv:Body></soapenv:Envelope>`;

  return xml;
};


exports.getupdateCredentialsByAdminXml = (username, newpassword) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:updateCredentialByAdmin><ser:userName>${username}</ser:userName><ser:newCredential>${newpassword}</ser:newCredential></ser:updateCredentialByAdmin></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getuserListXml = (limit) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:listUsers><ser:filter></ser:filter><ser:maxItemLimit>${limit}</ser:maxItemLimit></ser:listUsers></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateRoleNameXml = (req, res) => {
  var input = JSON.parse(JSON.stringify(req.body));
  var oldrolename = input.oldrolename;
  var newrolename = input.newrolename;

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:updateRoleName><ser:roleName>${oldrolename}</ser:roleName><ser:newRoleName>${newrolename}</ser:newRoleName></ser:updateRoleName></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getallRolesXml = () => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:getRoleNames/></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getAllUserRolesXml = (username) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:getRoleListOfUser><ser:userName>${username}</ser:userName></ser:getRoleListOfUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getAllUserForRolesXml = (rolename) => {


  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:getUserListOfRole><ser:roleName>${rolename}</ser:roleName></ser:getUserListOfRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getRoleExistsXml = (req, res) => {
  var input = JSON.parse(JSON.stringify(req.body));
  var roleName = input.roleName;

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:isExistingRole><ser:roleName>${roleName}</ser:roleName></ser:isExistingRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getuserExistsXml = (req, res) => {
  var input = JSON.parse(JSON.stringify(req.body));
  var username = input.username;

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:isExistingUser><ser:userName>${username}</ser:userName></ser:isExistingUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};


exports.updateUserRoleXml = (username, oldrole, newrole) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:updateRoleListOfUser><ser:userName>${username}</ser:userName><ser:deletedRoles>${oldrole}</ser:deletedRoles><ser:newRoles>${newrole}</ser:newRoles> </ser:updateRoleListOfUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateUserRoleCreationXml = (username, newrole) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:updateRoleListOfUser><ser:userName>${username}</ser:userName><ser:newRoles>${newrole}</ser:newRoles></ser:updateRoleListOfUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getUserProfile = (username) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.profile.user.identity.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <mgt:getUserProfile><mgt:username>${username}</mgt:username><mgt:profileName>default</mgt:profileName></mgt:getUserProfile></soapenv:Body></soapenv:Envelope>`;

  return xml;
};


exports.createUserClaimsXml = (claimkeys, username) => {

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addUserClaimValues><ser:userName>${username}</ser:userName><ser:claimURI>http://wso2.org/claims/${claimkeys[0].key}</ser:claimURI><ser:claimValue>${claimkeys[0].value}</ser:claimValue><ser:profileName>default</ser:profileName></ser:addUserClaimValues></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateProfileXml = (claimkeys, username) => {

  let claimsXml = '';
  _.each(claimkeys, (cl) => {
    claimsXml += `<xsd:fieldValues><xsd:claimUri>http://wso2.org/claims/${cl.key}</xsd:claimUri><xsd:fieldValue>${cl.value}</xsd:fieldValue></xsd:fieldValues>`;
  });

  let xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.profile.user.identity.carbon.wso2.org" xmlns:xsd="http://mgt.profile.user.identity.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><mgt:setUserProfile><mgt:username>{username}</mgt:username><mgt:profile>${claimsXml}<xsd:profileName>default</xsd:profileName></mgt:profile></mgt:setUserProfile></soapenv:Body></soapenv:Envelope>`;
  return xml;
};
