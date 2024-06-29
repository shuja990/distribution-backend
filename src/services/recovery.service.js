const { Recovery, User, Transaction, Sequelize } = require('../models');
const { Op } = Sequelize;

const createRecovery = async (recoveryData) => {
    // Retrieve the transaction to which this recovery belongs
    const transaction = await Transaction.findByPk(recoveryData.transactionId);
    if (!transaction) {
        throw new Error('Transaction not found');
    }

    // Calculate the total amount recovered so far for this transaction
    const totalRecovered = await Recovery.sum('amount', {
        where: { transactionId: recoveryData.transactionId }
    });

    // Check if the recovery exceeds the transaction amount
    const newTotalRecovered = totalRecovered + recoveryData.amount;
    if (newTotalRecovered > transaction.amount) {
        throw new Error('Recovery amount exceeds the transaction amount');
    }

    // Determine if this recovery is partial or full
    recoveryData.status = (newTotalRecovered === transaction.amount) ? 'completed' : 'pending';

    // Create the recovery
    const recovery = await Recovery.create(recoveryData);

    // Update the transaction's payment status and remaining amount
    transaction.paymentStatus = (newTotalRecovered === transaction.amount) ? 'paid' : 'partial';
    await transaction.save();

    return recovery;
};

const getRecoveryById = async (id) => {
    return await Recovery.findByPk(id, {
        include: [
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
            { model: Transaction, as: 'transaction', attributes: ['id', 'amount', 'paymentStatus', 'description'] }
        ]
    });
};

const getAllRecoveries = async (currentUserId, filters = {}) => {
    const query = {
        where: { createdBy: currentUserId },
        include: [
            { model: Transaction, as: 'transaction', attributes: ['id', 'amount', 'paymentStatus', 'description'] },
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
        ]
    };

    if (filters.status) {
        query.where.status = filters.status;
    }
    if (filters.transactionId) {
        query.where.transactionId = filters.transactionId;
    }
    if (filters.dateRange) {
        query.where.recoveryDate = {
            [Op.between]: [filters.dateRange.start, filters.dateRange.end]
        };
    }
    if (filters.lastMonth) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth(), 0);
        query.where.recoveryDate = {
            [Op.between]: [firstDay, lastDay]
        };
    }
    if (filters.lastYear) {
        const now = new Date();
        const firstDay = new Date(now.getFullYear() - 1, 0, 1);
        const lastDay = new Date(now.getFullYear() - 1, 11, 31);
        query.where.recoveryDate = {
            [Op.between]: [firstDay, lastDay]
        };
    }

    const recoveries = await Recovery.findAll(query);
    return recoveries;
};

const updateRecovery = async (id, recoveryData) => {
    try {
        const recovery = await Recovery.findByPk(id);
        if (!recovery) {
            return { message: 'Recovery not found' };
        }

        const [updatedRowsCount, updatedRows] = await Recovery.update(recoveryData, {
            where: { id },
            returning: true,
            plain: true
        });

        if (updatedRowsCount === 0) {
            return { message: 'No changes made' };
        }

        const updatedRecovery = updatedRows.get({ plain: true });
        return { message: 'Recovery updated successfully', recovery: updatedRecovery };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteRecovery = async (id) => {
    const result = await Recovery.destroy({
        where: { id }
    });
    if (result === 1) {
        return { message: 'Recovery deleted successfully' };
    }
    return { message: 'Recovery not found' };
};

module.exports = {
    createRecovery,
    getRecoveryById,
    getAllRecoveries,
    updateRecovery,
    deleteRecovery
};
