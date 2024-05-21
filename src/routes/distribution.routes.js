const express = require('express');
const { celebrate, errors } = require('celebrate');
const distributionController = require('../controllers/distribution.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const CONSTANTS = require('../config/contants');
const distributionSchemas = require('../request-schemas/distribution.schema');
const router = express.Router();

router.post('/',
    celebrate(distributionSchemas.createDistribution),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    distributionController.createDistribution
);

router.get('/',
    celebrate(distributionSchemas.getAllDistributions),
    authMiddleware,
    distributionController.getAllDistributions
);

router.get('/:id',
    celebrate(distributionSchemas.getDistribution),
    authMiddleware,
    distributionController.getDistribution
);

router.put('/:id',
    celebrate(distributionSchemas.updateDistribution),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    distributionController.updateDistribution
);

router.delete('/:id',
    celebrate(distributionSchemas.deleteDistribution),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN, CONSTANTS.roles.ADMIN]),
    distributionController.deleteDistribution
);

// Error handler for Celebrate validation errors
router.use(errors());

module.exports = router;
