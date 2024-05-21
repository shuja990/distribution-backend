const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
  const Distribution = sequelize.define('Distribution', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    companyName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    initialInvestment: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    }
  });

  Distribution.associate = (models) => {
    Distribution.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy'
    });
  };

  return Distribution;
};
