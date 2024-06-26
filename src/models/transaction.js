const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const Transaction = sequelize.define('Transaction', {
        id: {
            type: DataTypes.UUID,
            defaultValue: UUIDV4,
            primaryKey: true
        },
        amount: {
            type: DataTypes.FLOAT,
            allowNull: false
        },
        paymentStatus: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isIn: [['paid', 'credit', 'partial']]
            }
        },
        description: {
            type: DataTypes.TEXT,
            allowNull: true
        },
        createdBy: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        salesmanId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Salesman',
                key: 'id'
            }
        },
        distributionId: {
            type: DataTypes.UUID,
            allowNull: true,
            references: {
                model: 'Distribution',
                key: 'id'
            }
        },
        isActive: {
            type: DataTypes.BOOLEAN,
            defaultValue: true
        }
    }, {
        tableName: 'Transactions'
    });

    Transaction.associate = (models) => {
        Transaction.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'createdBy'
        });
        Transaction.belongsTo(models.Salesman, {
            as: 'salesman',
            foreignKey: 'salesmanId'
        });
        Transaction.belongsTo(models.Distribution, {
            as: 'distribution',
            foreignKey: 'distributionId'
        });
    };

    return Transaction;
};
