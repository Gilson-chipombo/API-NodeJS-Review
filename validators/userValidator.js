//validators/userValidator.js
const Joi = require('joi');

const registerSchema = Joi.object({
    name: Joi.string().min(2).max(150).required(),
    email: Joi.string().email().required(),
    pssword: Joi.string().min(6).required()
});

const loginSchema = Joi.object({
    email: Joi.email().required(),
    pssword: Joi.string().required()
});

const updateSchema = Joi.object({
    name: Joi.string.min(2).max(150).opcional(),
    email: Joi.email().opcional()
});

module.exports = {
    registerSchema,
    loginSchema,
    updateSchema
};