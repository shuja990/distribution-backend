const express = require('express');
const { celebrate, errors } = require('celebrate');
const userController = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');
const CONSTANTS = require('../config/contants');
const userSchemas = require('../request-schemas/user.schema');
const router = express.Router();

router.post('/create-user',
    celebrate(userSchemas.createUser),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN]),
    userController.registerUser
);

router.post('/login', celebrate(userSchemas.loginUser), userController.loginUser);

router.get('/',
    celebrate(userSchemas.getAllUsers),
    authMiddleware,
    userController.getAllUsers
);

router.get('/:id',
    celebrate(userSchemas.getUser),
    authMiddleware,
    userController.getUser
);

router.put('/:id',
    celebrate(userSchemas.updateUser),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN]),
    userController.updateUser
);

router.delete('/:id',
    celebrate(userSchemas.deleteUser),
    authMiddleware,
    roleMiddleware([CONSTANTS.roles.SUPER_ADMIN]),
    userController.deleteUser
);

// Error handler for Celebrate validation errors
router.use(errors());

module.exports = router;
