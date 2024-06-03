const Joi = require('joi');

const expenseSchemas = {
    createExpense: {
        body: Joi.object({
            amount: Joi.number().required(),
            paymentStatus: Joi.string().valid('paid', 'credit').required(),
            description: Joi.string().allow(null, ''),
            createdBy: Joi.string().uuid().required(),
            distributionId: Joi.string().uuid().allow(null, ''),
            isActive: Joi.boolean().default(true)
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    getAllExpenses: {
        query: Joi.object({
            paymentStatus: Joi.string().valid('paid', 'credit').optional(),
            distributionId: Joi.string().uuid().optional(),
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
    getExpense: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    updateExpense: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            amount: Joi.number(),
            paymentStatus: Joi.string().valid('paid', 'credit'),
            description: Joi.string().allow(null, ''),
            createdBy: Joi.string().uuid(),
            distributionId: Joi.string().uuid().allow(null, ''),
            isActive: Joi.boolean()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    deleteExpense: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    markAsPaid: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }
};

module.exports = expenseSchemas;
