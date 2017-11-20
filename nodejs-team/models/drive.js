'use strict';
module.exports = (sequelize, DataTypes) => {
  var Drive = sequelize.define('Drive', {
    parent_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    path: DataTypes.STRING,
    fileType: DataTypes.INTEGER,
    size: DataTypes.DOUBLE,
    sha_256: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Drive;
};