const { Transaction, Salesman, Distribution, User } = require('../models');
const { Op } = require('sequelize');

const createTransaction = async (transactionData) => {
    return await Transaction.create(transactionData);
};

const getTransactionById = async (id) => {
    return await Transaction.findByPk(id, {
        include: [
            { model: Salesman, as: 'salesman', attributes: ['id', 'name', 'contactInfo', 'address'] },
            { model: Distribution, as: 'distribution', attributes: ['id', 'companyName', 'details', 'initialInvestment'] },
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
        ]
    });
};

const updateTransaction = async (id, transactionData) => {
    const [updated] = await Transaction.update(transactionData, {
        where: { id }
    });
    if (updated) {
        const updatedTransaction = await getTransactionById(id);
        return updatedTransaction;
    }
    throw new Error('Transaction not found');
};

const deleteTransaction = async (id) => {
    const deleted = await Transaction.destroy({
        where: { id }
    });
    if (deleted) {
        return true;
    }
    throw new Error('Transaction not found');
};

const markAsPaid = async (id, paidAmount) => {
    const transaction = await getTransactionById(id);
    if (!transaction) throw new Error('Transaction not found');

    if (transaction.paymentStatus === 'paid') {
        throw new Error('Transaction is already fully paid');
    }

    if (transaction.paymentStatus === 'credit' || transaction.paymentStatus === 'partial') {
        transaction.amountPaid = (transaction.amountPaid || 0) + paidAmount;

        if (transaction.amountPaid >= transaction.amount) {
            transaction.paymentStatus = 'paid';
        } else {
            transaction.paymentStatus = 'partial';
        }

        await transaction.save();
        return transaction;
    }
};

const getAllTransactions = async (filters) => {
    const query = {
        where: {},
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

    return await Transaction.findAll(query);
};

module.exports = {
    createTransaction,
    getTransactionById,
    updateTransaction,
    deleteTransaction,
    markAsPaid,
    getAllTransactions
};
