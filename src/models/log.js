module.exports = (sequelize, DataTypes) => {
    const Log = sequelize.define('Log', {
      level: {
        type: DataTypes.STRING,
        allowNull: false
      },
      message: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      timestamp: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
    }, {
      timestamps: true // To include createdAt and updatedAt
    });
  
    return Log;
  };
  