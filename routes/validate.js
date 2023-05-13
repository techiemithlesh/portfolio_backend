const Joi = require('joi');

function validate(reqBody) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(5).max(30).required(),
  });

  return schema.validate(reqBody);
}

module.exports = validate;
