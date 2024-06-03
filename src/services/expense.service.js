const { Expense, User, Distribution, Sequelize } = require('../models');
const { Op } = Sequelize;

const createExpense = async (expenseData) => {
    return await Expense.create(expenseData);
};

const getExpenseById = async (id) => {
    return await Expense.findByPk(id, {
        include: [
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] },
            { model: Distribution, as: 'distribution', attributes: ['id', 'companyName', 'details', 'initialInvestment'] }
        ]
    });
};

const getAllExpenses = async (currentUserId, filters = {}) => {
    const query = {
        where: { createdBy: currentUserId },
        include: [
            { model: Distribution, as: 'distribution', attributes: ['id', 'companyName', 'details', 'initialInvestment'] },
            { model: User, as: 'creator', attributes: ['id', 'username', 'email'] }
        ]
    };

    if (filters.paymentStatus) {
        query.where.paymentStatus = filters.paymentStatus;
    }
    if (filters.distributionId) {
        query.where.distributionId = filters.distributionId;
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

    const expenses = await Expense.findAll(query);
    return expenses;
};

const updateExpense = async (id, expenseData) => {
    try {
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return { message: 'Expense not found' };
        }

        const [updatedRowsCount, updatedRows] = await Expense.update(expenseData, {
            where: { id },
            returning: true,
            plain: true
        });

        if (updatedRowsCount === 0) {
            return { message: 'No changes made' };
        }

        const updatedExpense = updatedRows.get({ plain: true });
        return { message: 'Expense updated successfully', expense: updatedExpense };
    } catch (error) {
        throw new Error(error.message);
    }
};

const deleteExpense = async (id) => {
    const result = await Expense.destroy({
        where: { id }
    });
    if (result === 1) {
        return { message: 'Expense deleted successfully' };
    }
    return { message: 'Expense not found' };
};

const markAsPaid = async (id) => {
    try {
        const expense = await Expense.findByPk(id);
        if (!expense) {
            return { message: 'Expense not found' };
        }

        expense.isPaid = true;
        expense.paymentStatus = 'paid';
        await expense.save();

        return { message: 'Expense marked as paid successfully', expense };
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = {
    createExpense,
    getExpenseById,
    getAllExpenses,
    updateExpense,
    deleteExpense,
    markAsPaid
};
