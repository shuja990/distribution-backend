const { Transaction, User, Salesman, Distribution, Recovery, Sequelize } = require('../models');
const { Op } = Sequelize;
// const redis = require('redis');
// const client = redis.createClient();
const { refreshMaterializedView } = require('../utils/materializedViews');

// client.on('error', (err) => {
//     console.error('Redis error:', err);
// });

const createTransaction = async (transactionData) => {
    const sequelize = Transaction.sequelize;
    return await sequelize.transaction(async (t) => {
        // Create the transaction
        const transaction = await Transaction.create(transactionData, { transaction: t });

        // Create recovery record if the transaction is partially or fully paid
        if (transactionData.paymentStatus === 'partial') {
            await Recovery.create({
                amount: transactionData.amount,
                recoveryDate: new Date(),
                status: 'pending',
                transactionId: transaction.id,
                createdBy: transactionData.createdBy
            }, { transaction: t });
        } else if (transactionData.paymentStatus === 'paid') {
            await Recovery.create({
                amount: transactionData.amount,
                recoveryDate: new Date(),
                status: 'completed',
                transactionId: transaction.id,
                createdBy: transactionData.createdBy
            }, { transaction: t });
        }

        // Invalidate cache
        // client.del(`transactions:${transactionData.createdBy}:*`);

        // Refresh materialized view
        await refreshMaterializedView();

        return transaction;
    });
};

const getTransactionById = async (id) => {
    return await Transaction.findByPk(id, {
        include: [
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
            { model: Salesman, as: 'salesman', attributes: ['id', 'name', 'contactInfo', 'address'] },
            { model: Distribution, as: 'distribution', attributes: ['id', 'companyName', 'details', 'initialInvestment'] },
            { model: Recovery, as: 'recoveries', attributes: ['id', 'amount', 'recoveryDate', 'status'] }
        ]
    });
};

const getAllTransactions = async (currentUserId, filters = {}) => {
    const cacheKey = `transactions:${currentUserId}:${JSON.stringify(filters)}`;

    return new Promise(async (resolve, reject) => {
        // client.get(cacheKey, async (err, cachedData) => {
        //     if (err) return reject(err);
        //     if (cachedData) {
        //         return resolve(JSON.parse(cachedData));
        //     }

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

            // client.setex(cacheKey, 3600, JSON.stringify(transactions)); // Cache for 1 hour
            resolve(transactions);
        });
    // });
};

const updateTransaction = async (id, transactionData) => {
    const sequelize = Transaction.sequelize;
    return await sequelize.transaction(async (t) => {
        const transaction = await Transaction.findByPk(id, { transaction: t });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        const [updatedRowsCount, updatedRows] = await Transaction.update(transactionData, {
            where: { id },
            returning: true,
            plain: true,
            transaction: t
        });

        if (updatedRowsCount === 0) {
            throw new Error('No changes made');
        }

        const updatedTransaction = updatedRows.get({ plain: true });

        // Update recovery records if the transaction is partially or fully paid
        if (transactionData.paymentStatus === 'partial') {
            await Recovery.create({
                amount: transactionData.amount,
                recoveryDate: new Date(),
                status: 'pending',
                transactionId: updatedTransaction.id,
                createdBy: transactionData.createdBy
            }, { transaction: t });
        } else if (transactionData.paymentStatus === 'paid') {
            await Recovery.create({
                amount: transactionData.amount,
                recoveryDate: new Date(),
                status: 'completed',
                transactionId: updatedTransaction.id,
                createdBy: transactionData.createdBy
            }, { transaction: t });
        }

        // Invalidate cache
        // client.del(`transactions:${transactionData.createdBy}:*`);

        // Refresh materialized view
        await refreshMaterializedView();

        return { message: 'Transaction updated successfully', transaction: updatedTransaction };
    });
};

const deleteTransaction = async (id, deleteRecoveries) => {
    const sequelize = Transaction.sequelize;
    return await sequelize.transaction(async (t) => {
        const transaction = await Transaction.findByPk(id, { transaction: t });
        if (!transaction) {
            throw new Error('Transaction not found');
        }

        if (deleteRecoveries) {
            await Recovery.destroy({ where: { transactionId: id }, transaction: t });
        }

        await Transaction.destroy({ where: { id }, transaction: t });

        // Invalidate cache
        // client.del(`transactions:${transaction.createdBy}:*`);

        // Refresh materialized view
        await refreshMaterializedView();

        return { message: 'Transaction and related recoveries deleted successfully' };
    });
};

module.exports = {
    createTransaction,
    getTransactionById,
    getAllTransactions,
    updateTransaction,
    deleteTransaction
};
