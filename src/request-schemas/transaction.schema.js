const Joi = require('joi');

const transactionSchemas = {
    createTransaction: {
        body: Joi.object({
            amount: Joi.number().required(),
            paymentStatus: Joi.string().valid('paid', 'credit', 'partial').required(),
            description: Joi.string().allow(null, ''),
            createdBy: Joi.string().uuid().required(),
            salesmanId: Joi.string().uuid().allow(null, ''),
            distributionId: Joi.string().uuid().allow(null, ''),
            isActive: Joi.boolean().default(true)
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    getAllTransactions: {
        query: Joi.object({
            paymentStatus: Joi.string().valid('paid', 'credit', 'partial').optional(),
            salesmanId: Joi.string().uuid().optional(),
            distributionId: Joi.string().uuid().optional(),
            type: Joi.string().optional(),
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
    getTransaction: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    updateTransaction: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            amount: Joi.number(),
            paymentStatus: Joi.string().valid('paid', 'credit', 'partial'),
            description: Joi.string().allow(null, ''),
            createdBy: Joi.string().uuid(),
            salesmanId: Joi.string().uuid().allow(null, ''),
            distributionId: Joi.string().uuid().allow(null, ''),
            isActive: Joi.boolean()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    deleteTransaction: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        query: Joi.object({
            deleteRecoveries: Joi.boolean().optional()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }
};

module.exports = transactionSchemas;
