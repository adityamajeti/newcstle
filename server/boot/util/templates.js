
exports.CreateTenantXml = function(active,adminName,adminPassword,email,firstName,
	 	lastName,tenantDomain) {

	
 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org" xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'
      +'<soapenv:Header/>'
      +'<soapenv:Body>'
      +'<ser:addTenant>'
      +'<ser:tenantInfoBean>'
      +'<xsd:active>'+active+'</xsd:active>'
      +'<xsd:admin>'+adminName+'</xsd:admin>'
      +'<xsd:adminPassword>'+adminPassword+'</xsd:adminPassword>'
      +'<xsd:email>'+email+'</xsd:email>'
      +'<xsd:firstname>'+firstName+'</xsd:firstname>'
      +'<xsd:lastname>'+lastName+'</xsd:lastname>'
      +'<xsd:tenantDomain>'+tenantDomain+'</xsd:tenantDomain>'
      +'</ser:tenantInfoBean>'
      +'</ser:addTenant>'
      +'</soapenv:Body>'
     +'</soapenv:Envelope>';

    return xml;
}

exports.getAllTenantsXml =function()
{

  /*let xml ='<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org">'
           +'<soap:Header/>'
           +'<soap:Body>'
           +'<ser:retrieveTenants/>'
           +'</soap:Body>'
           +'</soap:Envelope>';*/


     let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org">'
             +'<soapenv:Header/>'
             +'<soapenv:Body>'
             +'<ser:retrieveTenants/>'
             +'</soapenv:Body>'
             +'</soapenv:Envelope>' ;     

      return xml;     

}

exports.getAllTenantByDomainXml =function(req,res)
{

   var input = JSON.parse(JSON.stringify(req.body));
   var tenantDomain =input.tenantDomain;


 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org">'
            +'<soapenv:Header/>'
           +'<soapenv:Body>'
           +'<ser:getTenant>'
           +'<ser:tenantDomain>'+tenantDomain+'</ser:tenantDomain>'
           +'</ser:getTenant>'
           +'</soapenv:Body>'
           +'</soapenv:Envelope>';

       return xml;

}


exports.UpdateTenantXml = function(active,adminName,adminPassword,email,firstName,
    lastName,tenantDomain,tenantId) {
  
 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org" xmlns:xsd="http://beans.common.stratos.carbon.wso2.org/xsd">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
   +'<ser:updateTenant>'
   +'<ser:tenantInfoBean>'
   +'<xsd:active>'+active+'</xsd:active>'
   +'<xsd:admin>'+adminName+'</xsd:admin>'
   +'<xsd:adminPassword>'+adminPassword+'</xsd:adminPassword>'
   +'<xsd:email>'+email+'</xsd:email>'
   +'<xsd:firstname>'+firstName+'</xsd:firstname>'
   +'<xsd:lastname>'+lastName+'</xsd:lastname>'
   +'<xsd:tenantDomain>'+tenantDomain+'</xsd:tenantDomain>'
   +'<xsd:tenantId>'+tenantId+'</xsd:tenantId>'
   +'</ser:tenantInfoBean>'
   +'</ser:updateTenant>'
   +'</soapenv:Body>'
   +'</soapenv:Envelope>';

    return xml;
}

exports.getdeleteTenantXml =function(tenantDomain)
{

  
 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org">'
            +'<soapenv:Header/>'
           +'<soapenv:Body>'
           +'<ser:deleteTenant>'
           +'<ser:tenantDomain>'+tenantDomain+'</ser:tenantDomain>'
           +'</ser:deleteTenant>'
           +'</soapenv:Body>'
           +'</soapenv:Envelope>';

       return xml;

}

exports.getdeactivateTenantXml =function(tenantDomain)
{

 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org">'
            +'<soapenv:Header/>'
           +'<soapenv:Body>'
           +'<ser:deactivateTenant>'
           +'<ser:tenantDomain>'+tenantDomain+'</ser:tenantDomain>'
           +'</ser:deactivateTenant>'
           +'</soapenv:Body>'
           +'</soapenv:Envelope>';

       return xml;

}


exports.getactivateTenantXml =function(tenantDomain)
{

  
   var tenantDomain =input.tenantDomain;


 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://services.mgt.tenant.carbon.wso2.org">'
            +'<soapenv:Header/>'
           +'<soapenv:Body>'
           +'<ser:activateTenant>'
           +'<ser:tenantDomain>'+tenantDomain+'</ser:tenantDomain>'
           +'</ser:activateTenant>'
           +'</soapenv:Body>'
           +'</soapenv:Envelope>';

       return xml;

}

//Add User

/*<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd">
   <soapenv:Header/>
   <soapenv:Body>
      <ser:addUser>
         <!--Optional:-->
         <ser:userName>user2</ser:userName>
         <!--Optional:-->
         <ser:credential>welcome</ser:credential>
         <ser:roleList>CityUser</ser:roleList>
         <ser:roleList>ReportAdmin</ser:roleList>
          <ser:claims>
            <!--Optional:-->
            <xsd:claimURI>http://wso2.org/claims/timeZone</xsd:claimURI>
            <!--Optional:-->
            <xsd:value>IST</xsd:value>
         </ser:claims>
         <!--Optional:-->
         <ser:profileName>default</ser:profileName>
         <!--Optional:-->
         <ser:requirePasswordChange>false</ser:requirePasswordChange>
      </ser:addUser>
   </soapenv:Body>
</soapenv:Envelope>*/

//add role



exports.getaddRoleXml =function(rolename)
{

  

 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://dao.service.ws.um.carbon.wso2.org/xsd">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
   +'<ser:addRole>'
   +'<ser:roleName>'+rolename+'</ser:roleName>'
   +'</ser:addRole>'
   +'</soapenv:Body>'
   +'</soapenv:Envelope>';

       return xml;

}

exports.deleteRoleXml =function(rolename)
{
  

 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
 +'<soapenv:Header/>'
   +'<soapenv:Body>'
   +'<ser:deleteRole>'
   +'<ser:roleName>'+rolename+'</ser:roleName>'
   +'</ser:deleteRole>'
   +'</soapenv:Body>'
   +'</soapenv:Envelope>';

   return xml;
}

exports.createUserXml =function(rolename,claimkeys,username,password)
{
  console.log(rolename);

  if(Array.isArray(rolename))
  {
    console.log("array");
  }
   
   let rolesXml ="";
   let claimsXml ="";
   if(rolename.length>0){
   for( indx =0; indx <rolename.length; indx ++)
   {
   	if(rolesXml==""){
       rolesXml= ' <ser:roleList>'+rolename[indx].rolename+'</ser:roleList>'
   	}else{
   		rolesXml =rolesXml+' <ser:roleList>'+rolename[indx].rolename+'</ser:roleList>';
   	}

     
   }
    }
  
   if(claimkeys.length>0){
    
   for( inx =0; inx <claimkeys.length; inx ++)
   {
    var claimuri ="";
   	if(claimsXml==""){
       claimuri="http://wso2.org/claims/"+claimkeys[inx].key+"";

      claimsXml= '<ser:claims> <xsd:claimURI>'+claimuri+'</xsd:claimURI><xsd:value>'+claimkeys[inx].value+'</xsd:value></ser:claims>';
   	}else{
      claimuri="http://wso2.org/claims/"+claimkeys[inx].key+"";
      claimsXml= claimsXml+'<ser:claims> <xsd:claimURI>'+claimuri+'</xsd:claimURI><xsd:value>'+claimkeys[inx].value+'</xsd:value></ser:claims>';
   	

   	}

     
   }

 }


 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd">'
    +'<soapenv:Header/>'
    +'<soapenv:Body>'
    +'<ser:addUser>'
    +'<ser:userName>'+username+'</ser:userName>'
    +'<ser:credential>'+password+'</ser:credential>';


  let newxml = xml+rolesXml;

   
   let xml1=claimsXml;

     let xml2 ='<ser:profileName>default</ser:profileName>'
          +'<ser:requirePasswordChange>false</ser:requirePasswordChange>'
          +'</ser:addUser>'
          +'</soapenv:Body>'
          +'</soapenv:Envelope>';

       
    let finalxml = newxml+xml1+xml2;     

    console.log(finalxml);
   return finalxml;
}

exports.deleteUserXml =function(username)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
      +'<soapenv:Header/>'
      +'<soapenv:Body>'
      +'<ser:deleteUser>'
      +'<ser:userName>'+username+'</ser:userName>'
      +'</ser:deleteUser>'
      +'</soapenv:Body>'
      +'</soapenv:Envelope>';

   return xml;
}

exports.gettenantIdXml =function(req,res)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
    +'<soapenv:Header/>'
    +'<soapenv:Body>'
    +'  <ser:getTenantId/>'
    +' </soapenv:Body>'
    +'</soapenv:Envelope>';

   return xml;
}


exports.getupdateCredentialsXml =function(username,oldpassword,newpassword)
{
  
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
       +'<soapenv:Header/>'
       +'<soapenv:Body>'
       +' <ser:updateCredential>'
       +' <ser:userName>'+username+'</ser:userName>'
       +' <ser:newCredential>'+newpassword+'</ser:newCredential>'
       +'<ser:oldCredential>'+oldpassword+'</ser:oldCredential>'
       +' </ser:updateCredential>'
       +'</soapenv:Body>'
       +'</soapenv:Envelope>';

   return xml;
}


exports.getupdateCredentialsByAdminXml =function(username,newpassword)
{
  
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
       +'<soapenv:Header/>'
       +'<soapenv:Body>'
       +' <ser:updateCredentialByAdmin>'
       +' <ser:userName>'+username+'</ser:userName>'
       +' <ser:newCredential>'+newpassword+'</ser:newCredential>'
       +' </ser:updateCredentialByAdmin>'
       +'</soapenv:Body>'
       +'</soapenv:Envelope>';

   return xml;
}

exports.getuserListXml =function(limit)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
   +'<ser:listUsers>'
   +'<ser:filter></ser:filter>'
   +'<ser:maxItemLimit>'+limit+'</ser:maxItemLimit>'
   +'</ser:listUsers>'
   +'</soapenv:Body>'
+'</soapenv:Envelope>';

   return xml;
}

exports.updateRoleNameXml =function(req,res)
{
   var input = JSON.parse(JSON.stringify(req.body));
   var oldrolename =input.oldrolename;
   var newrolename =input.newrolename;
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
    +'<soapenv:Header/>'
    +'<soapenv:Body>'
    +'<ser:updateRoleName>'
    +'<ser:roleName>'+oldrolename+'</ser:roleName>'
    +'<ser:newRoleName>'+newrolename+'</ser:newRoleName>'
    +'</ser:updateRoleName>'
    +'</soapenv:Body>'
    +'</soapenv:Envelope>';

   return xml;
}

exports.getallRolesXml =function()
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
   +'  <ser:getRoleNames/>'
   +'</soapenv:Body>'
   +'</soapenv:Envelope>';

   return xml;
}

exports.getAllUserRolesXml =function(username)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
       +'<soapenv:Header/>'
       +'<soapenv:Body>'
       +' <ser:getRoleListOfUser>'
       +' <ser:userName>'+username+'</ser:userName>'
       +'</ser:getRoleListOfUser>'
       +'</soapenv:Body>'
       +'</soapenv:Envelope>';

   return xml;
}

exports.getAllUserForRolesXml =function(rolename)
{
  
  
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
       +'<soapenv:Header/>'
       +'<soapenv:Body>'
       +' <ser:getUserListOfRole>'
       +' <ser:roleName>'+rolename+'</ser:roleName>'
       +'</ser:getUserListOfRole>'
       +'</soapenv:Body>'
       +'</soapenv:Envelope>';

   return xml;
}

exports.getRoleExistsXml =function(req,res)
{
   var input = JSON.parse(JSON.stringify(req.body));
   var roleName =input.roleName;
  
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
       +'<soapenv:Header/>'
       +'<soapenv:Body>'
       +' <ser:isExistingRole>'
       +' <ser:roleName>'+roleName+'</ser:roleName>'
       +'</ser:isExistingRole>'
       +'</soapenv:Body>'
       +'</soapenv:Envelope>';

   return xml;
}

exports.getuserExistsXml =function(req,res)
{
   var input = JSON.parse(JSON.stringify(req.body));
   var username =input.username;
  
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
       +'<soapenv:Header/>'
       +'<soapenv:Body>'
       +' <ser:isExistingUser>'
       +' <ser:userName>'+username+'</ser:userName>'
       +'</ser:isExistingUser>'
       +'</soapenv:Body>'
       +'</soapenv:Envelope>';

   return xml;
}


exports.updateUserRoleXml =function(username,oldrole,newrole)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
    +'<ser:updateRoleListOfUser>'
    +'<ser:userName>'+username+'</ser:userName>'
    +'<ser:deletedRoles>'+oldrole+'</ser:deletedRoles>'
    +'<ser:newRoles>'+newrole+'</ser:newRoles>'
     +' </ser:updateRoleListOfUser>'
   +'</soapenv:Body>'
 +'</soapenv:Envelope>';

   return xml;
}

exports.updateUserRoleCreationXml =function(username,newrole)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
    +'<ser:updateRoleListOfUser>'
    +'<ser:userName>'+username+'</ser:userName>'
    +'<ser:newRoles>'+newrole+'</ser:newRoles>'
     +' </ser:updateRoleListOfUser>'
   +'</soapenv:Body>'
 +'</soapenv:Envelope>';

   return xml;
}

exports.getUserProfile =function(username)
{
   
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.profile.user.identity.carbon.wso2.org">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
     +' <mgt:getUserProfile>'
      +' <mgt:username>'+username+'</mgt:username>'
      +'    <mgt:profileName>default</mgt:profileName>'
     +'</mgt:getUserProfile>'
   +'</soapenv:Body>'
    +'</soapenv:Envelope>';

   return xml;
}


exports.createUserClaimsXml =function(claimkeys,username)
{

 let claimsXml ="";  
let xml='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:ser="http://service.ws.um.carbon.wso2.org" xmlns:xsd="http://common.mgt.user.carbon.wso2.org/xsd">'
   +'<soapenv:Header/>'
   +'<soapenv:Body>'
    +'<ser:addUserClaimValues>'
    +'<ser:userName>'+username+'</ser:userName>'
    +'<ser:claimURI>http://wso2.org/claims/'+claimkeys[0].key+'</ser:claimURI>'
    +'<ser:claimValue>'+claimkeys[0].value+'</ser:claimValue>'
    +'<ser:profileName>default</ser:profileName>'
    +'</ser:addUserClaimValues>'
    +'</soapenv:Body>'
    +'</soapenv:Envelope>';
  
   return xml;
}

exports.updateProfileXml =function(claimkeys,username)
{
  
   let claimsXml ="";
  
   if(claimkeys.length>0){
    
   for( inx =0; inx <claimkeys.length; inx ++)
   {
    var claimuri ="";
    if(claimsXml==""){
       claimuri="http://wso2.org/claims/"+claimkeys[inx].key+"";

      claimsXml= '<xsd:fieldValues> <xsd:claimUri>'+claimuri+'</xsd:claimUri><xsd:fieldValue>'+claimkeys[inx].value+'</xsd:fieldValue></xsd:fieldValues>';
    }else{
      claimuri="http://wso2.org/claims/"+claimkeys[inx].key+"";
      claimsXml= claimsXml+ '<xsd:fieldValues> <xsd:claimUri>'+claimuri+'</xsd:claimUri><xsd:fieldValue>'+claimkeys[inx].value+'</xsd:fieldValue></xsd:fieldValues>';
 

    }

     
   }

 }


 let xml ='<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:mgt="http://mgt.profile.user.identity.carbon.wso2.org" xmlns:xsd="http://mgt.profile.user.identity.carbon.wso2.org/xsd">'
     +'<soapenv:Header/>'
    +'<soapenv:Body>'
     +'<mgt:setUserProfile>'
     +'<mgt:username>'+username+'</mgt:username>'
     +'<mgt:profile>';


  let newxml = xml+claimsXml;

   
     let xml2 =' <xsd:profileName>default</xsd:profileName>'
           +'</mgt:profile>'
           +'</mgt:setUserProfile>'
           +'</soapenv:Body>'
           +'</soapenv:Envelope>';

       
    let finalxml = newxml+xml2;     

    console.log(finalxml);
   return finalxml;
}


