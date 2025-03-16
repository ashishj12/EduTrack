import Joi from "joi";

// Validate registration input
export const validateRegistration = (data) => {
  const schema = Joi.object({
    username: Joi.string().required(),
    password: Joi.string().required(),
    name: Joi.string().required(),
    branch: Joi.string().required(),
    batch: Joi.string().required(),
    semester: Joi.number().required(),
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

export const validateFacultyLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const validateAdminRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};


export const validateAdminLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    secretKey: Joi.string().required()
  });

  return schema.validate(data);
};