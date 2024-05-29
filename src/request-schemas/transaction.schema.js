const Joi = require('joi');

const transactionSchemas = {
    createTransaction: {
        body: Joi.object({
            amount: Joi.number().required(),
            type: Joi.string().valid('sale', 'expense').required(),
            paymentStatus: Joi.string().valid('paid', 'credit', 'partial').required(),
            description: Joi.string().optional(),
            salesmanId: Joi.string().uuid().optional(),
            distributionId: Joi.string().uuid().optional()
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
            amount: Joi.number().optional(),
            type: Joi.string().valid('sale', 'expense').optional(),
            paymentStatus: Joi.string().valid('paid', 'credit', 'partial').optional(),
            description: Joi.string().optional(),
            salesmanId: Joi.string().uuid().optional(),
            distributionId: Joi.string().uuid().optional()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    markAsPaid: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            paidAmount: Joi.number().required()
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
            type: Joi.string().valid('sale', 'expense').optional(),
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
    }
};

module.exports = transactionSchemas;
