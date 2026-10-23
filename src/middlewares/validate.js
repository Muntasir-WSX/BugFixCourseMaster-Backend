// middleware to validate request bodies against Zod schemas asynchronously

const validate = (schema) => async (req, res, next) => {
  try {
    req.body = await schema.parseAsync(req.body);
    next();
  } catch (err) {
    return res.status(400).json({
      message: "Validation error",
      errors: err.errors || err.message,
    });
  }
};

module.exports = validate;