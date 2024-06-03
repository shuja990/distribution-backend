const { DataTypes, UUIDV4 } = require('sequelize');

module.exports = (sequelize) => {
    const Expense = sequelize.define('Expense', {
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
                isIn: [['paid', 'credit']]
            }
        },
        isPaid: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
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
        tableName: 'Expenses'
    });

    Expense.associate = (models) => {
        Expense.belongsTo(models.User, {
            as: 'creator',
            foreignKey: 'createdBy'
        });
        Expense.belongsTo(models.Distribution, {
            as: 'distribution',
            foreignKey: 'distributionId'
        });
    };

    return Expense;
};
