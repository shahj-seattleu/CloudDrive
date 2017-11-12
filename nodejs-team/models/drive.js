'use strict';
module.exports = (sequelize, DataTypes) => {
  var Drive = sequelize.define('Drive', {
    parent_id: { type: DataTypes.INTEGER,defaultValue: 0 },
    name: { type: DataTypes.STRING, allowNull: false },
    path: { type: DataTypes.STRING, unique: true , allowNull: false },
    fileType: DataTypes.INTEGER,
    size: { type: DataTypes.DOUBLE, validate: {max: 200000.0 } },
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        Drive.hasMany(models.Drive);
        Drive.belongsTo(models.Drive, { as: "parent" });

      }
    }
  });
  return Drive;
};
