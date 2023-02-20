const { body, validationResult } = require('express-validator')

exports.validateQuestion = [
    body('question').notEmpty().withMessage("Question cannot be empty"),
    body('type').notEmpty().withMessage("Type cannot be empty"),
    body('topic').notEmpty().withMessage("Topic cannot be empty"),
    body('answer').notEmpty().withMessage("Answer cannot be empty"),
    body('displayType').notEmpty().withMessage("Display type cannot be empty"),
    body('options').custom((value, {req}) => {
        if ((value.length-1) !== 0 && !value.includes(req.body.answer))
        {
            throw new Error("The correct answer must be present in the answer options")
        } else {
            return value
        }
    }).optional({ checkFalsy: true }),
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty())
          return res.status(422).json({errors: errors.array()});
        next();
    },
];