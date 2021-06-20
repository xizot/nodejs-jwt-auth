const Joi = require("@hapi/joi");

const loginValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).max(12).required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};
const registerValidation = (data) => {
    const schema = Joi.object({
        fullname: Joi.string().min(6).max(50).required(),
        username: Joi.string().min(3).max(12).required(),
        password: Joi.string().required(),
    });

    return schema.validate(data);
};

module.exports = { loginValidation, registerValidation };
