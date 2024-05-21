const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const Salesman = sequelize.define('Salesman', {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        contactInfo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        address: {
            type: DataTypes.TEXT,
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
    }, {
        tableName: 'Salesman' // Explicitly specify the table name
    });

    Salesman.associate = (models) => {
        Salesman.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'createdBy'
        });
    };

    return Salesman;
};
