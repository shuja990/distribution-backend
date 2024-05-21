const Joi = require('joi');
const CONSTANTS = require('../config/contants');

const distributionSchemas = {
    createDistribution: {
        body: Joi.object({
            companyName: Joi.string().required(),
            details: Joi.string().optional(),
            initialInvestment: Joi.number().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown() // Allow other headers but require authorization
    },
    getAllDistributions: {
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    getDistribution: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    updateDistribution: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            companyName: Joi.string(),
            details: Joi.string(),
            initialInvestment: Joi.number(),
            isActive: Joi.boolean()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    deleteDistribution: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }
};

module.exports = distributionSchemas;
