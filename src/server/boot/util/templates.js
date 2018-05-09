'use strict';
/* eslint quotes: "off" */
const _ = require('underscore');

exports.CreateTenantXml = (adminUsername, adminPassword, email, firstname,
  lastname, tenantId) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org" xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addTenant><ser:tenantInfoBean><xsd:active>true</xsd:active><xsd:admin>${adminUsername}</xsd:admin><xsd:adminPassword>${adminPassword}</xsd:adminPassword><xsd:email>${email}</xsd:email><xsd:firstname>${firstname}</xsd:firstname><xsd:lastname>${lastname}</xsd:lastname><xsd:tenantDomain>${tenantId}</xsd:tenantDomain></ser:tenantInfoBean></ser:addTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getAllTenantsXml = () => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:retrieveTenants/></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getTenantByDomainXml = (req, res) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:getTenant><ser:tenantDomain>${req.body.tenantDomain}</ser:tenantDomain></ser:getTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.deleteTenantXml = (tenantId) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deleteTenant><ser:tenantDomain>${tenantId}</ser:tenantDomain></ser:deleteTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.deactivateTenantXml = (tenantDomain) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deactivateTenant><ser:tenantDomain>${tenantDomain}</ser:tenantDomain></ser:deactivateTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.activateTenantXml = (tenantDomain) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:activateTenant><ser:tenantDomain>${tenantDomain}</ser:tenantDomain></ser:activateTenant></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

// add role
exports.getaddRoleXml = (rolename) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://dao.service.ws.um.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addRole><ser:roleName>${rolename}</ser:roleName></ser:addRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.deleteRoleXml = (rolename) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deleteRole><ser:roleName>${rolename}</ser:roleName></ser:deleteRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.createUserXml = (roles, claims, username, password) => {
  let rolesXml = '';
  let claimsXml = '';

  _.each(rolename, (rl) => {
    rolesXml += `<ser:roleList>${rl.rolename}</ser:roleList>`;
  });

  _.each(claimkeys, (cl) => {
    claimsXml += `<ser:claims><xsd:claimURI>http://wso2.org/claims/${cl.key}</xsd:claimURI><xsd:value>${cl.value}</xsd:value></ser:claims>`;
  });

  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addUser><ser:userName>${username}</ser:userName><ser:credential>${password}</ser:credential>${rolesXml}${claimsXml}<ser:profileName>default</ser:profileName><ser:requirePasswordChange>false</ser:requirePasswordChange></ser:addUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.deleteUserXml = (username) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:deleteUser><ser:userName>${username}</ser:userName></ser:deleteUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.gettenantIdXml = (req, res) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:getTenantId/></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getupdateCredentialsXml = (username, oldpassword, newpassword) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:updateCredential> <ser:userName>${username}</ser:userName><ser:newCredential>${newpassword}</ser:newCredential><ser:oldCredential>${oldpassword}</ser:oldCredential> </ser:updateCredential></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getupdateCredentialsByAdminXml = (username, newpassword) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:updateCredentialByAdmin><ser:userName>${username}</ser:userName><ser:newCredential>${newpassword}</ser:newCredential></ser:updateCredentialByAdmin></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getuserListXml = (limit) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:listUsers><ser:filter></ser:filter><ser:maxItemLimit>${limit}</ser:maxItemLimit></ser:listUsers></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateRoleNameXml = (req, res) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:updateRoleName><ser:roleName>${req.body.oldrolename}</ser:roleName><ser:newRoleName>${req.body.newrolename}</ser:newRoleName></ser:updateRoleName></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getallRolesXml = () => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:getRoleNames/></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getAllUserRolesXml = (username) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:getRoleListOfUser><ser:userName>${username}</ser:userName></ser:getRoleListOfUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getAllUserForRolesXml = (rolename) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:getUserListOfRole><ser:roleName>${rolename}</ser:roleName></ser:getUserListOfRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getRoleExistsXml = (req, res) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:isExistingRole><ser:roleName>${req.body.roleName}</ser:roleName></ser:isExistingRole></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getuserExistsXml = (req, res) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <ser:isExistingUser><ser:userName>${req.body.username}</ser:userName></ser:isExistingUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateUserRoleXml = (username, oldrole, newrole) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:updateRoleListOfUser><ser:userName>${username}</ser:userName><ser:deletedRoles>${oldrole}</ser:deletedRoles><ser:newRoles>${newrole}</ser:newRoles> </ser:updateRoleListOfUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateUserRoleCreationXml = (username, newrole) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org"><soapenv:Header/><soapenv:Body><ser:updateRoleListOfUser><ser:userName>${username}</ser:userName><ser:newRoles>${newrole}</ser:newRoles></ser:updateRoleListOfUser></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.getUserProfile = (username) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.profile.user.identity.carbon.wso2.org"><soapenv:Header/><soapenv:Body> <mgt:getUserProfile><mgt:username>${username}</mgt:username><mgt:profileName>default</mgt:profileName></mgt:getUserProfile></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.createUserClaimsXml = (claimkeys, username) => {
  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><ser:addUserClaimValues><ser:userName>${username}</ser:userName><ser:claimURI>http://wso2.org/claims/${claimkeys[0].key}</ser:claimURI><ser:claimValue>${claimkeys[0].value}</ser:claimValue><ser:profileName>default</ser:profileName></ser:addUserClaimValues></soapenv:Body></soapenv:Envelope>`;

  return xml;
};

exports.updateProfileXml = (claimkeys, username) => {
  let claimsXml = '';
  _.each(claimkeys, (cl) => {
    claimsXml += `<xsd:fieldValues><xsd:claimUri>http://wso2.org/claims/${cl.key}</xsd:claimUri><xsd:fieldValue>${cl.value}</xsd:fieldValue></xsd:fieldValues>`;
  });

  const xml = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.profile.user.identity.carbon.wso2.org" xmlns:xsd="http://mgt.profile.user.identity.carbon.wso2.org/xsd"><soapenv:Header/><soapenv:Body><mgt:setUserProfile><mgt:username>{username}</mgt:username><mgt:profile>${claimsXml}<xsd:profileName>default</xsd:profileName></mgt:profile></mgt:setUserProfile></soapenv:Body></soapenv:Envelope>`;
  return xml;
};
