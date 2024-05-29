const express = require('express');
const transactionController = require('../controllers/transaction.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const { celebrate, errors } = require('celebrate');
const transactionSchemas = require('../request-schemas/transaction.schema');
const CONSTANTS = require('../config/contants');

const router = express.Router();

router.post('/',
    celebrate(transactionSchemas.createTransaction),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.ADMIN]),
    transactionController.createTransaction
);

router.get('/:id',
    celebrate({
        params: transactionSchemas.updateTransaction.params,
        headers: transactionSchemas.createTransaction.headers
    }),
    authMiddleware,
    transactionController.getTransaction
);

router.put('/:id',
    celebrate(transactionSchemas.updateTransaction),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.ADMIN]),
    transactionController.updateTransaction
);

router.delete('/:id',
    celebrate({
        params: transactionSchemas.updateTransaction.params,
        headers: transactionSchemas.createTransaction.headers
    }),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.ADMIN]),
    transactionController.deleteTransaction
);

router.patch('/:id/mark-paid',
    celebrate(transactionSchemas.markAsPaid),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.ADMIN]),
    transactionController.markAsPaid
);

router.get('/',
    celebrate(transactionSchemas.getAllTransactions),
    authMiddleware,
    transactionController.getAllTransactions
);

router.use(errors());

module.exports = router;
