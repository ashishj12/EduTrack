import Joi from "joi";

// Validate registration input
export const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

// Validate login input
export const validateLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};