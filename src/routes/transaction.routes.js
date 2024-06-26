const express = require('express');
const { celebrate, errors } = require('celebrate');
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const transactionSchemas = require('../request-schemas/transaction.schema');
const CONSTANTS = require('../config/contants');
const router = express.Router();

router.post('/create',
    celebrate(transactionSchemas.createTransaction),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    transactionController.createTransaction
);

router.get('/:id',
    celebrate(transactionSchemas.getTransaction),
    authMiddleware,
    transactionController.getTransaction
);

router.get('/',
    celebrate(transactionSchemas.getAllTransactions),
    authMiddleware,
    transactionController.getAllTransactions
);

router.put('/:id',
    celebrate(transactionSchemas.updateTransaction),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    transactionController.updateTransaction
);

router.delete('/:id',
    celebrate(transactionSchemas.deleteTransaction),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    transactionController.deleteTransaction
);

// Error handler for Celebrate validation errors
router.use(errors());

module.exports = router;
