const Joi = require('joi');
const CONTANTS = require('../config/contants');

const userSchemas = {
    createUser: {
        body: Joi.object({
            username: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required(),
            role: Joi.string().valid(CONTANTS.roles.ADMIN, CONTANTS.roles.SUPER_ADMIN).required()
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown() // Allow other headers but require authorization
    },
    getAllUsers: {
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    loginUser: {
        body: Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(6).required()
        })
    },
    getUser: {
        params: Joi.object({
            id: Joi.string().uuid().required() // Assuming the id is a UUID
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    updateUser: {
        params: Joi.object({
            id: Joi.string().uuid().required() // Assuming the id is a UUID
        }),
        body: Joi.object({
            username: Joi.string(),
            email: Joi.string().email(),
            password: Joi.string().min(6),
            role: Joi.string().valid(CONTANTS.roles.ADMIN, CONTANTS.roles.SUPER_ADMIN)
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    },
    deleteUser: {
        params: Joi.object({
            id: Joi.string().uuid().required() // Assuming the id is a UUID
        }),
        headers: Joi.object({
            authorization: Joi.string().required()
        }).unknown()
    }
};

module.exports = userSchemas;
