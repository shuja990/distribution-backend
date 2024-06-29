const express = require('express');
const { celebrate, errors } = require('celebrate');
const expenseController = require('../controllers/expense.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const CONSTANTS = require('../config/contants');
const expenseSchemas = require('../request-schemas/expense.schema');
const router = express.Router();

router.post('/create',
    celebrate(expenseSchemas.createExpense),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    expenseController.createExpense
);

router.get('/:id',
    celebrate(expenseSchemas.getExpense),
    authMiddleware,
    expenseController.getExpense
);

router.get('/',
    celebrate(expenseSchemas.getAllExpenses),
    authMiddleware,
    expenseController.getAllExpenses
);

router.put('/:id',
    celebrate(expenseSchemas.updateExpense),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    expenseController.updateExpense
);

router.delete('/:id',
    celebrate(expenseSchemas.deleteExpense),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    expenseController.deleteExpense
);

router.put('/:id/mark-as-paid',
    celebrate(expenseSchemas.markAsPaid),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    expenseController.markAsPaid
);

// Error handler for Celebrate validation errors
router.use(errors());

module.exports = router;
