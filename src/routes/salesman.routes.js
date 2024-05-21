const express = require('express');
const { celebrate, errors } = require('celebrate');
const salesmanController = require('../controllers/salesman.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const CONSTANTS = require('../config/contants');
const salesmanSchemas = require('../request-schemas/salesman.schema');
const router = express.Router();

router.post('/',
    celebrate(salesmanSchemas.createSalesman),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    salesmanController.createSalesman
);

router.get('/',
    celebrate(salesmanSchemas.getAllSalesmen),
    authMiddleware,
    salesmanController.getAllSalesmen
);

router.get('/:id',
    celebrate(salesmanSchemas.getSalesman),
    authMiddleware,
    salesmanController.getSalesman
);

router.put('/:id',
    celebrate(salesmanSchemas.updateSalesman),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    salesmanController.updateSalesman
);

router.delete('/:id',
    celebrate(salesmanSchemas.deleteSalesman),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    salesmanController.deleteSalesman
);

router.patch('/:id/activate',
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    salesmanController.activateSalesman
);

router.patch('/:id/deactivate',
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    salesmanController.deactivateSalesman
);

// Error handler for Celebrate validation errors
router.use(errors());

module.exports = router;
