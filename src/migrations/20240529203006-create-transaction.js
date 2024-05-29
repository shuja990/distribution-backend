'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['sale', 'expense']]
        }
      },
      paymentStatus: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          isIn: [['paid', 'credit', 'partial']]
        }
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      salesmanId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Salesman',
          key: 'id'
        }
      },
      distributionId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Distributions',
          key: 'id'
        }
      },
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
      },
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};
