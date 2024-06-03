const { Transaction, User, Salesman, Distribution, Sequelize } = require('../models');
const { Op } = Sequelize;

const createTransaction = async (transactionData) => {
    // Create the transaction
    const transaction = await Transaction.create(transactionData);

    // Placeholder: If the transaction is partially paid, create a recovery record
    if (transactionData.paymentStatus === 'partial') {
        // Implement recovery creation logic here
    }

    return transaction;
};

const getTransactionById = async (id) => {
    return await Transaction.findByPk(id, {
        include: [
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
            { model: Salesman, as: 'salesman', attributes: ['id', 'name', 'contactInfo', 'address'] },
            { model: Distribution, as: 'distribution', attributes: ['id', 'companyName', 'details', 'initialInvestment'] }
        ]
    });
};

const getAllTransactions = async (currentUserId, filters = {}) => {
    const query = {
        where: { createdBy: currentUserId },
        include: [
            { model: Salesman, as: 'salesman', attributes: ['id', 'name', 'contactInfo', 'address'] },
            { model: Distribution, as: 'distribution', attributes: ['id', 'companyName', 'details', 'initialInvestment'] },
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
        ]
    };

    if (filters.paymentStatus) {
        query.where.paymentStatus = filters.paymentStatus;
    }
    if (filters.salesmanId) {
        query.where.salesmanId = filters.salesmanId;
    }
    if (filters.distributionId) {
        query.where.distributionId = filters.distributionId;
    }
    if (filters.type) {
        query.where.type = filters.type;
    }
    if (filters.dateRange) {
        query.where.createdAt = {
            [Op.between]: [filters.dateRange.start, filters.dateRange.end]
        };
    }
    if (filters.lastMonth) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        query.where.createdAt = {
            [Op.between]: [firstDay, lastDay]
        };
    }
    if (filters.lastYear) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear() - 1, 0, 1);
        const lastDay = new Date(now.getFullYear() - 1, 11, 31);
        query.where.createdAt = {
            [Op.between]: [firstDay, lastDay]
        };
    }

    const transactions = await Transaction.findAll(query);
    return transactions;
};

const updateTransaction = async (id, transactionData) => {
    try {
        const transaction = await Transaction.findByPk(id);
        if (!transaction) {
            return { message: 'Transaction not found' };
        }

        const [updatedRowsCount, updatedRows] = await Transaction.update(transactionData, {
            where: { id },
            returning: true,
            plain: true
        });

        if (updatedRowsCount === 0) {
            return { message: 'No changes made' };
        }

        const updatedTransaction = updatedRows.get({ plain: true });

        // Placeholder: If the transaction is partially paid, create a recovery record
        if (transactionData.paymentStatus === 'partial') {
            // Implement recovery creation logic here
        }

        return { message: 'Transaction updated successfully', transaction: updatedTransaction };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteTransaction = async (id) => {
    const result = await Transaction.destroy({
        where: { id }
    });
    if (result === 1) {
        return { message: 'Transaction deleted successfully' };
    }
    return { message: 'Transaction not found' };
};

module.exports = {
    createTransaction,
    getTransactionById,
    getAllTransactions,
    updateTransaction,
    deleteTransaction
};
