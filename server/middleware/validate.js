const { body, validationResult } = require('express-validator');

/**
 * Validation rules for creating a contact.
 */
const createContactRules = [
  body('name')
    .trim()
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .trim()
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
  body('company')
    .optional({ checkFalsy: true })
    .trim(),
  body('role')
    .optional({ checkFalsy: true })
    .trim(),
  body('country')
    .optional({ checkFalsy: true })
    .trim(),
  body('countryCode')
    .optional({ checkFalsy: true })
    .trim(),
  body('favorite')
    .optional()
    .isBoolean().withMessage('Favorite must be a boolean'),
];

/**
 * Validation rules for updating a contact (all fields optional).
 */
const updateContactRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 100 }).withMessage('Name must be 2–100 characters'),
  body('email')
    .optional()
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail(),
  body('phone')
    .optional({ checkFalsy: true })
    .trim(),
  body('country')
    .optional({ checkFalsy: true })
    .trim(),
  body('countryCode')
    .optional({ checkFalsy: true })
    .trim(),
  body('favorite')
    .optional()
    .isBoolean().withMessage('Favorite must be a boolean'),
];

/**
 * Middleware: collect express-validator errors and return 400 if any exist.
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((e) => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

module.exports = {
  createContactRules,
  updateContactRules,
  handleValidationErrors,
};
