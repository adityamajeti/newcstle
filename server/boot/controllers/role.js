module.exports = function(app) {

  const {
    RoleMapping,
    Role,
    Users
  } = app.models;

  Role.validatesUniquenessOf('name', { message: 'A Role with same name already exists' });

  Role.byName = (name, cb) => {
    return Role.findOne({
      where: {
        name: name
      }
    }, cb);
  };

  RoleMapping.getUserIDsByRole = (role, cb) => {
    new Promise((resolve, reject) => {
      Role.byName(role).then(rl => {
        return RoleMapping.find({
          where: {
            roleId: rl.id,
            principalType: RoleMapping.USER
          }
        });
      }).then(mappings => {
        var users = mappings.map(function(m) {
          return m.principalId;
        });

        return cb ? cb(null, users) : resolve(users);
      }).catch(err => {
        return cb ? cb(err) : reject(err);
      });
    });

  };

  Role.observe("before save", (ctx, next) => {
    if (ctx.isNewInstance) {
      ctx.instance.unsetAttribute('modified');
    } else if (!!ctx.data) {
      delete ctx.data.modified;
    }
    next();
  });
  // console.log(Role.definition.name)
  Role.mixin("Timestamp", {});

};
