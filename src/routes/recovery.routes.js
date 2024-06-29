const express = require('express');
const { celebrate, errors } = require('celebrate');
const recoveryController = require('../controllers/recovery.controller.js');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const recoverySchemas = require('../request-schemas/recovery.schema');
const router = express.Router();
const CONSTANTS = require('../config/contants');

router.post('/create',
    celebrate(recoverySchemas.createRecovery),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    recoveryController.createRecovery
);

router.get('/:id',
    celebrate(recoverySchemas.getRecovery),
    authMiddleware,
    recoveryController.getRecovery
);

router.get('/',
    celebrate(recoverySchemas.getAllRecoveries),
    authMiddleware,
    recoveryController.getAllRecoveries
);

router.put('/:id',
    celebrate(recoverySchemas.updateRecovery),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    recoveryController.updateRecovery
);

router.delete('/:id',
    celebrate(recoverySchemas.deleteRecovery),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    recoveryController.deleteRecovery
);

// Error handler for Celebrate validation errors
router.use(errors());

module.exports = router;
