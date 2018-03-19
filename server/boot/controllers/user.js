module.exports = function(app) {

  const {
    Organization,
    RoleMapping,
    Role,
    Users,
    AccessToken
  } = app.models;

  var validRoles = ["admin", "OrganizationAdmin", "SystemEngineer"];

  Users.getUsersByRole = (role, callback) => {

    RoleMapping.getUserIDsByRole(role, (err, users) => {

      if (err || !users) {
        return callback(err);
      } else {
        return Users.find({
          where: {
            id: {
              inq: users
            }
          }
        }, callback);
      }
    });
  };

  Users.getRole = (id, cb) => {
    return new Promise((resolve, reject) => {
      RoleMapping.findOne({
        'where': {
          "principalId": id
        }
      }).then(rlmap => {
        if (rlmap) {
          return Role.findOne({
            'where': {
              "id": rlmap.roleId
            }
          });
        } else {
          throw new Error("User doesn't have a role");
        }
      }).then(rl => {
        var rlobj = {
          "id": rl.id,
          "name": rl.name
        };
        return cb ? cb(null, rlobj) : resolve(rlobj);
      }).catch(err => {
        return cb ? cb(err) : reject(err);
      });
    });
  };

  Users.roleCheck = (id, rolename, cb) => {
    return new Promise((resolve, reject) => {
      Users.getRole(id).then(rl => {
        if (rl && rl.name == rolename) {
          return cb ? cb(null, rl) : resolve(rl);
        } else {
          throw new Error("User role is invalid");
        }
      }).catch(err => {
        return cb ? cb(err) : reject(err);
      });
    });
  };

  Users.changeRole = async(id, newRole, cb) => {
    var rl = await Role.findOne({
      'where': {
        "or": [
          { "name": newRole },
          { "id": newRole }
        ]
      }
    });
    var rlmap = await RoleMapping.findOne({
      "where": {
        "and": [{
          "principalId": id
        }]
      }
    });
    var user = await Users.findById(id);
    return new Promise((resolve, reject) => {
      try {
        if (user) {
          if (rlmap) {
            if ((rl.id).toString() == (rlmap.roleId).toString()) {
              throw new Error('Role unchanged');
            } else {
              rlmap.destroy();
            }
          }
          rl.principals.create({
            principalType: RoleMapping.USER,
            principalId: id
          });
          var fobj = {
            "roleId": rl.id,
            "userId": id,
            "name": rl.name
          };
          return cb ? cb(null, fobj) : resolve(fobj);
        } else {
          throw new Error("User not found");
        }
      } catch (err) {
        return cb ? cb(err) : reject(err);
      };
    });

  };

  Users.findRoles = (cb) => {
    new Promise((resolve, reject) => {
      return cb ? Role.find({}, cb) : Role.find();
    });
  };

  Users.afterRemote("login", (ctx, instance, next) => {
    Users.getRole(ctx.result.userId).then(role => {
      ctx.result.role = role;
      next();
    }).catch(err => {
      AccessToken.destroyAll({ "userId": ctx.result.userId }, function(er, info) {
        //
      });
      next(err);
    });
  });

  Users.observe("before save", (ctx, next) => {
    if (ctx.isNewInstance) {
      if(ctx.instance.role) {
        ctx.instance.unsetAttribute('role');
      }
      Organization.findById(ctx.instance.tenantId).then(org => {
        ctx.instance.realm = org.realm;
        next();
      }).catch(err => {
        next(err);
      });
    } else {
      if(ctx.instance && ctx.instance.realm) {
        ctx.instance.unsetAttribute('realm');
      } else if(ctx.data && ctx.data.realm) {
        delete ctx.data.realm;
      }
      next();
    }
  });

};
