const Joi = require('joi');

const salesmanSchemas = {
    createSalesman: {
        body: Joi.object({
            name: Joi.string().required(),
            contactInfo: Joi.string().required(),
            address: Joi.string().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown() // Allow other headers but require authorization
    },
    getAllSalesmen: {
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    getSalesman: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    updateSalesman: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        body: Joi.object({
            name: Joi.string(),
            contactInfo: Joi.string(),
            address: Joi.string(),
            isActive: Joi.boolean()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    deleteSalesman: {
        params: Joi.object({
            id: Joi.string().uuid().required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }
};

module.exports = salesmanSchemas;
