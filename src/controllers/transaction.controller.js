const transactionService = require('../services/transaction.service');

const createTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.createTransaction({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ message: 'Transaction created successfully', transaction });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getTransaction = async (req, res) => {
  try {
    const transaction = await transactionService.getTransactionById(req.params.id);
    if (transaction) {
      res.json({ message: 'Transaction found', transaction });
    } else {
      res.status(404).json({ message: 'Transaction not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllTransactions = async (req, res) => {
  try {
    const filters = req.query;
    const transactions = await transactionService.getAllTransactions(req.user.id, filters);
    if (transactions) {
      res.json({ message: 'Transactions found', transactions });
    } else {
      res.status(404).json({ message: 'Transactions not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateTransaction = async (req, res) => {
  try {
    const result = await transactionService.updateTransaction(req.params.id, req.body);
    if (result.message === 'Transaction not found') {
      return res.status(404).json(result);
    } else if (result.message === 'No changes made') {
      return res.status(400).json(result);
    } else {
      return res.json(result);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteTransaction = async (req, res) => {
  try {
    const result = await transactionService.deleteTransaction(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createTransaction,
  getTransaction,
  getAllTransactions,
  updateTransaction,
  deleteTransaction
};
