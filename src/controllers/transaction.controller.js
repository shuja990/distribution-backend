const transactionService = require('../services/transaction.services');

const createTransaction = async (req, res) => {
    try {
        const transaction = await transactionService.createTransaction(req.body);
        res.status(201).json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getTransaction = async (req, res) => {
    try {
        const transaction = await transactionService.getTransactionById(req.params.id);
        if (transaction) {
            res.status(200).json({ transaction });
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const updateTransaction = async (req, res) => {
    try {
        const transaction = await transactionService.updateTransaction(req.params.id, req.body);
        res.status(200).json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const deleteTransaction = async (req, res) => {
    try {
        const deleted = await transactionService.deleteTransaction(req.params.id);
        if (deleted) {
            res.status(204).json({message: 'Transaction deleted successfully'});
        } else {
            res.status(404).json({ message: 'Transaction not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const markAsPaid = async (req, res) => {
    try {
        const transaction = await transactionService.markAsPaid(req.params.id, req.body.paidAmount);
        res.status(200).json({ transaction });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const getAllTransactions = async (req, res) => {
    try {
        const filters = req.query;
        const transactions = await transactionService.getAllTransactions(filters);
        res.status(200).json({ transactions });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = {
    createTransaction,
    getTransaction,
    updateTransaction,
    deleteTransaction,
    markAsPaid,
    getAllTransactions
};
