module.exports = function(app) {

  const {
    Organization,
    RoleMapping,
    Role,
    Users,
    AccessToken
  } = app.models;

  var validRoles = ["OrganizationAdmin", "SystemEngineer"];

  Organization.beforeRemote("prototype.__create__users", (ctx, unused, next) => {
    if (ctx.args.data.role && validRoles.indexOf(ctx.args.data.role) > -1) {
      ctx.userSetRole = ctx.args.data.role;
      delete ctx.args.data['role'];
      next();
    } else {
      next("User 'role' is missing or invalid");
    }
  });

  Organization.afterRemote("prototype.__create__users", (ctx, remoteMethodResult, next) => {
    Users.changeRole((remoteMethodResult.id).toString(), ctx.userSetRole, (e, r) => {
      next();
    });
  });

  Organization.getUsersByRole = (id, role, cb) => {
    new Promise((resolve, reject) => {
      RoleMapping.getUserIDsByRole(role).then(users => {
        if (users && users.length) {
          var usrs = Users.find({
            where: {
              "and": [{
                "id": {
                  "inq": users
                }
              }, {
                "orgId": id
              }]
            }
          });
          return cb ? Users.find({
            where: {
              "and": [{
                "id": {
                  "inq": users
                }
              }, {
                "orgId": id
              }]
            }
          }, cb) : resolve(usrs);
        } else {
          return cb ? cb(null, []) : resolve([]);
        }

      }).catch(err => {
        return cb ? cb(err) : reject(err);
      });
    });
  };
};
