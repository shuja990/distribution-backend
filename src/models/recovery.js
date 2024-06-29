const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const Recovery = sequelize.define('Recovery', {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        recoveryDate: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['pending', 'completed']]
            }
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        transactionId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
                model: 'Transactions',
                key: 'id'
            }
        }
    }, {
        tableName: 'Recoveries'
    });

    Recovery.associate = (models) => {
        Recovery.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'createdBy'
        });
        Recovery.belongsTo(models.Transaction, {
            as: 'transaction',
            foreignKey: 'transactionId'
        });
    };

    return Recovery;
};
