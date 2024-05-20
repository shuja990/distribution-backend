const { DataTypes, UUIDV4 } = require('sequelize');
const bcrypt = require('bcryptjs');
const CONTANTS = require('../config/contants');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: UUIDV4,
      primaryKey: true
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        isIn: [[CONTANTS.roles.SUPER_ADMIN, CONTANTS.roles.ADMIN]]
      }
    },
    createdBy: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: 'Users',
        key: 'id'
      }
    }
  }, {
    hooks: {
      beforeSave: async (user) => {
        if (user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      }
    }
  });

  User.associate = (models) => {
    User.belongsTo(models.User, {
      as: 'creator',
      foreignKey: 'createdBy'
    });
  };

  return User;
};


// npx sequelize-cli migration:generate --name create-user
// npx sequelize-cli db:migrate:undo
// npx sequelize-cli db:migrate

