module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false
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
      createdBy: {
        type: Sequelize.UUID,
        allowNull: true,
        references: {
          model: 'Users',
          key: 'id'
        }
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
      isActive: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },

  down: async (queryInterface) => {
    await queryInterface.dropTable('Transactions');
  }
};
