const Joi = require('joi');

const recoverySchemas = {
    createRecovery: {
        body: Joi.object({
            amount: Joi.number().required(),
            recoveryDate: Joi.date().required(),
            status: Joi.string().valid('pending', 'completed').required(),
            createdBy: Joi.string().uuid().required(),
            transactionId: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    getAllRecoveries: {
        query: Joi.object({
            status: Joi.string().valid('pending', 'completed').optional(),
            transactionId: Joi.string().uuid().optional(),
            dateRange: Joi.object({
                start: Joi.date().required(),
                end: Joi.date().required()
            }).optional(),
            lastMonth: Joi.boolean().optional(),
            lastYear: Joi.boolean().optional()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    getRecovery: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    updateRecovery: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            amount: Joi.number(),
            recoveryDate: Joi.date(),
            status: Joi.string().valid('pending', 'completed'),
            createdBy: Joi.string().uuid(),
            transactionId: Joi.string().uuid()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    deleteRecovery: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }
};

module.exports = recoverySchemas;
