const expenseService = require('../services/expense.service');

const createExpense = async (req, res) => {
  try {
    const expense = await expenseService.createExpense({ ...req.body, createdBy: req.user.id });
    res.status(201).json({ message: 'Expense created successfully', expense });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getExpense = async (req, res) => {
  try {
    const expense = await expenseService.getExpenseById(req.params.id);
    if (expense) {
      res.json({ message: 'Expense found', expense });
    } else {
      res.status(404).json({ message: 'Expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getAllExpenses = async (req, res) => {
  try {
    const filters = req.query;
    const expenses = await expenseService.getAllExpenses(req.user.id, filters);
    if (expenses) {
      res.json({ message: 'Expenses found', expenses });
    } else {
      res.status(404).json({ message: 'Expenses not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateExpense = async (req, res) => {
  try {
    const result = await expenseService.updateExpense(req.params.id, req.body);
    if (result.message === 'Expense not found') {
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

const deleteExpense = async (req, res) => {
  try {
    const result = await expenseService.deleteExpense(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const markAsPaid = async (req, res) => {
  try {
    const result = await expenseService.markAsPaid(req.params.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  createExpense,
  getExpense,
  getAllExpenses,
  updateExpense,
  deleteExpense,
  markAsPaid
};
