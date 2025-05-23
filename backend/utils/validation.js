import Joi from "joi";

// Validate Student Register
export const validateStudentRegistration = (data) => {
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

// Validate student login
export const validateStudentLogin = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
  });

  return schema.validate(data);
};

export const validateFacultyRegister = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(), 
    department: Joi.string().required(),
    // subjects: Joi.array().items(Joi.string().hex()).optional()
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

export const validateAssignSubject = (data) => {
  const schema = Joi.object({
    subjectName: Joi.string().required(),
    subjectSem: Joi.number().required(),
    facultyId: Joi.string().hex().length(24).required(),
  });

  return schema.validate(data);
};

export const validateGetAssignedSubjects = (data) => {
  const schema = Joi.object({
    facultyId: Joi.string().hex().length(24).required(),
    subjectId: Joi.string().hex().length(24).optional(),
  });

  return schema.validate(data);
};

export const validateCorrection = (data) => {
  const schema = Joi.object({
    subjectId: Joi.string().hex().length(24).required(),
    date: Joi.date().required(),
    reason: Joi.string().required(),
    details: Joi.string().required(),
  });

  return schema.validate(data);
};
