"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Reclamation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    
  }
  Reclamation.init(
    {
      object: DataTypes.STRING,
      message: DataTypes.STRING,
      statut: DataTypes.BOOLEAN,
      ownerId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "Reclamation",
    }
  );
  return Reclamation;
};
