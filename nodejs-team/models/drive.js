'use strict';
module.exports = (sequelize, DataTypes) => {
  var Drive = sequelize.define('Drive', {
    parent_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    fileType: DataTypes.INTEGER,
    size: DataTypes.DOUBLE
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Drive.hasMany(models.Drive);
        Drive.belongsTo(models.Drive, { as: "parent_id" });

      }
    }
  });
  return Drive;
};
